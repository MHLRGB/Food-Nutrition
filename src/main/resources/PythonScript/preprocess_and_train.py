import sys
import json
import os
import numpy as np
from sqlalchemy import create_engine, text
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

# 사용자 입력 텍스트 전처리 함수
def preprocess_text(text):
    text = text.encode('utf-8', errors='ignore').decode('utf-8')
    text = re.sub(r'[^가-힣a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    processed_words = text.lower().split()
    return processed_words

# 입력 텍스트의 벡터를 계산하는 함수 (사용자 입력에만 적용)
def get_recipe_vector(text):
    words = preprocess_text(text)
    valid_words = [word for word in words if word in model.wv]
    if not valid_words:
        return np.zeros(model.vector_size)  # 빈 벡터 반환
    vector = np.mean([model.wv[word] for word in valid_words], axis=0)
    return vector

# 코사인 유사도를 계산하는 함수
def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

# 병렬로 벡터 유사도를 계산하는 함수
def compute_similarity(row, input_vector):
    try:
        vector = np.fromstring(row['processed_vector'][1:-1], sep=',')
        return cosine_similarity(vector, input_vector)
    except Exception as e:
        return 0

# 키워드 추출 함수 (사용자 입력에만 적용)
def extract_keywords(text):
    words = preprocess_text(text)
    return set(words)

# 키워드 매칭 점수 계산 함수 (미리 전처리된 레시피 키워드 사용)
def keyword_matching_score(input_keywords, recipe_keywords):
    recipe_words = set(recipe_keywords.split())
    return len(input_keywords.intersection(recipe_words)) / len(input_keywords) if input_keywords else 0

# 비동기 데이터베이스 연결 풀 생성
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

# 비동기로 유사한 레시피를 찾는 함수
async def get_similar_recipes_async(pool, input_vector, input_keywords, n=5, excluded_recipes=None):
    similarity_query = """
    SELECT 레시피_번호, 레시피_제목, 조리_이름, 조리_소개, 조리_재료_내용, processed_vector, processed_keywords
    FROM PreprocessedRecipes
    """

    if excluded_recipes:
        placeholders = ', '.join(['%s' for _ in excluded_recipes])
        exclusion_clause = f" WHERE 레시피_번호 NOT IN ({placeholders})"
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
        lambda row: keyword_matching_score(input_keywords, row['processed_keywords']),
        axis=1
    )

    recipes['final_similarity'] = np.where(
        input_vector_exists,
        0.3 * recipes['w2v_similarity'] + 0.7 * recipes['keyword_score'],
        recipes['keyword_score']
    )

    similar_recipes = recipes.nlargest(n, 'final_similarity')

    return similar_recipes

# 비동기로 사용자 입력을 처리하는 함수
async def process_input_async(pool, input_data):
    try:
        user_input_json = json.loads(input_data)
        user_input_text = user_input_json.get('input', '')
        excluded_recipes = user_input_json.get('excluded_recipes', [])

        input_vector = get_recipe_vector(user_input_text)
        input_keywords = extract_keywords(user_input_text)

        if not input_keywords:
            return {"error": "유효한 키워드를 입력해주세요."}

        similar_recipes = await get_similar_recipes_async(pool, input_vector, input_keywords, n=5, excluded_recipes=excluded_recipes)

        if similar_recipes.empty:
            return {"error": "추천 결과가 없습니다."}

        similar_recipes = similar_recipes.drop(['processed_vector', 'w2v_similarity', 'keyword_score', 'final_similarity'], axis=1)

        return similar_recipes.to_dict('records')
    except Exception as e:
        return {"error": f"오류 발생: {str(e)}"}

# 메인 함수 (비동기)
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
