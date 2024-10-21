import sys
import json
import os
import numpy as np
from sqlalchemy import create_engine, text
import pandas as pd
from gensim.models import Word2Vec
import re
import io

# 표준 출력을 UTF-8로 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 데이터베이스 연결 설정
db_config = {
    'host': 'foodlyze.c7sm4eciiv1v.ap-northeast-2.rds.amazonaws.com',
    'user': 'admin',
    'password': 'ehgus123',
    'database': 'Foodlyze'
}

# 데이터베이스 엔진 생성
try:
    engine = create_engine(f"mysql+mysqlconnector://{db_config['user']}:{db_config['password']}@{db_config['host']}/{db_config['database']}?charset=utf8mb4&ssl_ca=rds-ca-2019-root.pem")
except Exception as e:
    sys.exit(1)

# Word2Vec 모델 로드
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "word2vec_model.model")
try:
    model = Word2Vec.load(model_path)
except Exception as e:
    sys.exit(1)

def preprocess_text(text):
    text = text.encode('utf-8', errors='ignore').decode('utf-8')
    text = re.sub(r'[\udc80-\udcff]', '', text)  # 대체 문자 제거
    text = re.sub(r'[^가-힣a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    processed_words = text.lower().split()
    return processed_words

def get_recipe_vector(text):
    words = preprocess_text(text)
    valid_words = [word for word in words if word in model.wv]
    if not valid_words:
        return None
    vector = np.mean([model.wv[word] for word in valid_words], axis=0)
    return vector

def get_similar_recipes(input_vector, n=5, excluded_recipes=None):
    similarity_query = """
    SELECT 레시피_번호, 레시피_제목, 조리_이름, 조리_소개, 조리_재료_내용, processed_vector
    FROM PreprocessedRecipes_copy
    """

    params = {"v1": float(input_vector[0]), "v2": float(input_vector[1]), "v3": float(input_vector[2])}

    if excluded_recipes:
        placeholders = ', '.join([':excluded_' + str(i) for i in range(len(excluded_recipes))])
        exclusion_clause = f" WHERE 레시피_번호 NOT IN ({placeholders})"
        similarity_query += exclusion_clause
        params.update({f"excluded_{i}": rid for i, rid in enumerate(excluded_recipes)})

    similarity_query += " ORDER BY RAND() LIMIT :n"  # 유사도 대신 랜덤으로 선택 (간단화)
    params["n"] = n

    try:
        with engine.connect() as connection:
            result = connection.execute(text(similarity_query), params)
            similar_recipes = pd.DataFrame(result.fetchall(), columns=result.keys())
        return similar_recipes
    except Exception as e:
        return pd.DataFrame()

def process_input(input_data):
    try:
        user_input_json = json.loads(input_data)
        user_input_text = user_input_json.get('input', '')
        excluded_recipes = user_input_json.get('excluded_recipes', [])
        input_vector = get_recipe_vector(user_input_text)

        if input_vector is None:
            return {"error": "입력 텍스트를 처리할 수 없습니다."}

        similar_recipes = get_similar_recipes(input_vector, n=5, excluded_recipes=excluded_recipes)

        if similar_recipes.empty:
            return {"error": "추천 결과가 없습니다."}

        similar_recipes = similar_recipes.drop('processed_vector', axis=1)

        return similar_recipes.to_dict('records')
    except Exception as e:
        return {"error": f"오류 발생: {str(e)}"}

if __name__ == "__main__":
    try:
        input_data = sys.stdin.buffer.read().decode('utf-8').strip()
        result = process_input(input_data)
        json_result = json.dumps(result, ensure_ascii=False)
        print(json_result)  # 직접 print 사용
        sys.stdout.flush()
    except Exception as e:
        error_result = json.dumps({"error": str(e)}, ensure_ascii=False)
        print(error_result)  # 직접 print 사용
        sys.stdout.flush()
