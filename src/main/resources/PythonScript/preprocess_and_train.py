import sys
import json
import os
import numpy as np
import pandas as pd
from gensim.models import Word2Vec
import re
import io
import asyncio
import aiomysql
from concurrent.futures import ThreadPoolExecutor

# 표준 출력을 UTF-8로 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 데이터베이스 연결 설정
db_config = {
    'host': 'foodlyze.c7sm4eciiv1v.ap-northeast-2.rds.amazonaws.com',
    'user': 'admin',
    'password': 'ehgus123',
    'database': 'Foodlyze'
}

# Word2Vec 모델 로드
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "word2vec_model.model")
try:
    model = Word2Vec.load(model_path)
except Exception as e:
    sys.exit(1)

# 캐시 파일 경로 설정
cache_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache.json")

# 캐시 초기화 및 로드
if os.path.exists(cache_file_path):
    with open(cache_file_path, "r", encoding="utf-8") as cache_file:
        cache = json.load(cache_file)
else:
    cache = {}

# 유의어 매핑 정의
synonym_dict = {
    "추천": ["추천해줘", "추천해", "추천이야", "추천해줄래", "알려줘", "알려", "알려줄래", "있을까", "있어"],
    "요리": ["요리법", "조리법", "음식", "메뉴", "요리", "식사"],
    "좋은": ["추천", "강추", "권해", "좋아요", "권하다", "추천하다", "먹기 좋은"],
    "안주": ["요깃거리", "과자"],
    "보양식": ["보양", "몸보신", "보신"]
}

def normalize_synonyms(text):
    words = text.split()
    normalized_words = []
    for word in words:
        normalized_word = word
        for key, synonyms in synonym_dict.items():
            if word in synonyms:
                normalized_word = key
                break
        normalized_words.append(normalized_word)
    return " ".join(normalized_words)

def preprocess_text(text):
    text = normalize_synonyms(text)
    text = text.encode('utf-8', errors='ignore').decode('utf-8')
    text = re.sub(r'[\udc80-\udcff]', '', text)
    text = re.sub(r'[^가-힣a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    processed_words = text.lower().split()
    return processed_words

def get_recipe_vector(text):
    words = preprocess_text(text)
    valid_words = [word for word in words if word in model.wv]
    if not valid_words:
        return np.zeros(model.vector_size)
    vector = np.mean([model.wv[word] for word in valid_words], axis=0)
    return vector

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

def compute_similarity(row, input_vector):
    try:
        vector = np.fromstring(row['processed_vector'][1:-1], sep=',')
        return cosine_similarity(vector, input_vector)
    except Exception as e:
        return 0

def extract_keywords(text):
    words = preprocess_text(text)
    return set(words)

def keyword_matching_score(keywords, recipe_text):
    recipe_words = set(recipe_text.lower().split())
    return len(keywords.intersection(recipe_words)) / len(keywords) if keywords else 0

def create_cache_key(text):
    keywords = extract_keywords(text)
    extended_keywords = set(keywords)
    for word in keywords:
        if word in model.wv:
            similar_words = [similar_word for similar_word, _ in model.wv.most_similar(word, topn=2)]
            extended_keywords.update(similar_words)
    return json.dumps(sorted(extended_keywords), ensure_ascii=False)

def save_cache(new_key, new_value):
    if new_key not in cache:
        cache[new_key] = new_value
        with open(cache_file_path, "w", encoding="utf-8") as cache_file:
            json.dump(cache, cache_file, ensure_ascii=False)

async def create_pool():
    return await aiomysql.create_pool(
        host=db_config['host'],
        user=db_config['user'],
        password=db_config['password'],
        db=db_config['database'],
        charset='utf8mb4',
        cursorclass=aiomysql.DictCursor,
        autocommit=True
    )

async def get_similar_recipes_async(pool, input_vector, input_keywords, n=5, excluded_recipes=None):
    similarity_query = """
    SELECT recipe_number, recipe_title, recipe_info, ingredient_content, hashtag, by_type, by_situation, by_ingredient, by_method, processed_vector
    FROM PreprocessedRecipes
    """

    if excluded_recipes:
        placeholders = ', '.join(['%s' for _ in excluded_recipes])
        exclusion_clause = f" WHERE recipe_number NOT IN ({placeholders})"
        similarity_query += exclusion_clause

    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(similarity_query, excluded_recipes or ())
            result = await cur.fetchall()

    recipes = pd.DataFrame(result)
    input_vector_exists = np.any(input_vector)

    if input_vector_exists:
        with ThreadPoolExecutor() as executor:
            recipes['w2v_similarity'] = list(executor.map(lambda row: compute_similarity(row, input_vector), recipes.itertuples()))
    else:
        recipes['w2v_similarity'] = 0

    recipes['keyword_score'] = recipes.apply(
        lambda row: keyword_matching_score(
            input_keywords,
            f"{row['recipe_title']} {row['recipe_info']} {row['ingredient_content']}"
        ),
        axis=1
    )

    recipes['final_similarity'] = np.where(
        input_vector_exists,
        0.3 * recipes['w2v_similarity'] + 0.7 * recipes['keyword_score'],
        recipes['keyword_score']
    )

    similar_recipes = recipes.nlargest(n, 'final_similarity')
    return similar_recipes

async def process_input_async(pool, input_data):
    try:
        user_input_json = json.loads(input_data)
        user_input_text = user_input_json.get('input', '')
        excluded_recipes = user_input_json.get('excluded_recipes', [])

        cache_key = create_cache_key(user_input_text)

        if cache_key in cache:
            return cache[cache_key]

        input_vector = get_recipe_vector(user_input_text)
        input_keywords = extract_keywords(user_input_text)

        if not input_keywords:
            return {"error": "유효한 키워드를 입력해주세요."}

        similar_recipes = await get_similar_recipes_async(pool, input_vector, input_keywords, n=5, excluded_recipes=excluded_recipes)

        if similar_recipes.empty:
            return {"error": "추천 결과가 없습니다."}

        similar_recipes = similar_recipes.drop(['processed_vector', 'w2v_similarity', 'keyword_score', 'final_similarity'], axis=1)
        result = similar_recipes.to_dict('records')

        save_cache(cache_key, result)

        return result
    except Exception as e:
        return {"error": f"오류 발생: {str(e)}"}

async def main():
    pool = await create_pool()
    try:
        input_data = sys.stdin.buffer.read().decode('utf-8').strip()
        result = await process_input_async(pool, input_data)
        json_result = json.dumps(result, ensure_ascii=False)
        print(json_result)
        sys.stdout.flush()
    except Exception as e:
        error_result = json.dumps({"error": str(e)}, ensure_ascii=False)
        print(error_result)
        sys.stdout.flush()
    finally:
        pool.close()
        await pool.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())