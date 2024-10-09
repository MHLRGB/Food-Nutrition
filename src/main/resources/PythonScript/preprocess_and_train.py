# -*- coding: utf-8 -*-
import sys
import json
import logging
import io
import numpy as np
from sqlalchemy import create_engine
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import Word2Vec
from konlpy.tag import Okt
import os

# 입출력 스트림을 UTF-8로 설정
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 현재 스크립트의 디렉토리를 가져옵니다.
current_dir = os.path.dirname(os.path.abspath(__file__))

# 로깅 설정
log_file = os.path.join(current_dir, 'recommendation_log.txt')
logging.basicConfig(filename=log_file, level=logging.DEBUG, encoding='utf-8',
                    format='%(asctime)s - %(levelname)s - %(message)s')
logging.debug("Recommendation script started")

# 데이터베이스 연결 설정
db_config = {
    'host': 'foodlyze.c7sm4eciiv1v.ap-northeast-2.rds.amazonaws.com',
    'user': 'admin',
    'password': 'ehgus123',
    'database': 'Foodlyze'
}

# SSL 없이 데이터베이스 연결
engine = create_engine(f"mysql+mysqlconnector://{db_config['user']}:{db_config['password']}@{db_config['host']}/{db_config['database']}")

# Word2Vec 모델 로드
model_path = os.path.join(current_dir, "word2vec_model.model")
model = Word2Vec.load(model_path)

okt = Okt()

def preprocess_text(text):
    return okt.nouns(text)

def get_recipe_vector(words):
    valid_words = [word for word in words if word in model.wv]
    if not valid_words:
        return None
    return np.mean([model.wv[word] for word in valid_words], axis=0)

def recommend_recipes(input_text, n=5, excluded_recipes=None):
    processed_input = preprocess_text(input_text)
    logging.debug(f"Processed user input: {processed_input}")

    input_vector = get_recipe_vector(processed_input)
    if input_vector is None:
        logging.warning("No valid words found in input text")
        return pd.DataFrame()

    # 데이터베이스에서 전처리된 레시피 데이터 가져오기
    query = "SELECT 레시피_번호, 레시피_제목, 조리_이름, 조리_소개, 조리_재료_내용, processed_vector FROM PreprocessedRecipes"
    df = pd.read_sql(query, engine)
    logging.debug(f"Fetched {len(df)} recipes from database")

    # 이전에 추천된 레시피 제외
    if excluded_recipes:
        df = df[~df['레시피_번호'].isin(excluded_recipes)]
        logging.debug(f"Excluded {len(excluded_recipes)} previously recommended recipes")

    # 문자열로 저장된 벡터를 numpy 배열로 변환
    df['processed_vector'] = df['processed_vector'].apply(lambda x: np.fromstring(x, sep=',') if isinstance(x, str) else None)
    df = df.dropna(subset=['processed_vector'])
    logging.debug(f"Recipes with valid vectors: {len(df)}")

    # 코사인 유사도 계산
    similarities = cosine_similarity([input_vector], df['processed_vector'].tolist())[0]

    # 상위 n개의 유사한 레시피 선택
    top_indices = similarities.argsort()[-n:][::-1]
    recommended_recipes = df.iloc[top_indices]

    logging.debug(f"Recommended recipes: {recommended_recipes['레시피_번호'].tolist()}")
    return recommended_recipes

def clean_text(text):
    return text.encode('utf-8', errors='ignore').decode('utf-8')

try:
    # 표준 입력에서 JSON 데이터 읽기
    input_data = sys.stdin.read().strip()
    logging.debug(f"Raw input data: {repr(input_data)}")

    user_input_json = json.loads(input_data)
    user_input_text = user_input_json.get('input', '')
    excluded_recipes = user_input_json.get('excluded_recipes', [])

    # 입력 텍스트 정제
    user_input_text = clean_text(user_input_text)
    logging.debug(f"Cleaned user input text: {user_input_text}")
    logging.debug(f"Excluded recipes: {excluded_recipes}")

    # 레시피 추천
    recommended_recipes = recommend_recipes(user_input_text, excluded_recipes=excluded_recipes)

    if recommended_recipes.empty:
        print(json.dumps({"error": "No recommendations found"}, ensure_ascii=False))
    else:
        # JSON 형태로 변환 (한글 깨짐 방지)
        recipes_json = json.dumps(recommended_recipes[['레시피_번호', '레시피_제목', '조리_이름', '조리_소개', '조리_재료_내용']].to_dict('records'), ensure_ascii=False, indent=2)

        # 결과를 표준 출력으로 반환
        print(recipes_json)

    logging.debug("Script completed successfully")

except json.JSONDecodeError as e:
    logging.error(f"JSON decoding error: {str(e)}")
    print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}, ensure_ascii=False))
    sys.exit(1)
except Exception as e:
    logging.error(f"An error occurred: {str(e)}")
    print(json.dumps({"error": str(e)}, ensure_ascii=False))
    sys.exit(1)