import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv()

app = FastAPI()

# CORS設定 (Next.js:3000 からのアクセスを許可)
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini設定
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GENAI_API_KEY)

# リクエストデータの型定義
class UserData(BaseModel):
    bank_balance: int
    monthly_surplus: int

# レスポンスデータの型定義
class DiagnosisResponse(BaseModel):
    invest_amount: int
    target_name: str
    keep_amount: int
    advice: str

@app.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose(data: UserData):
    try:
        # --- step 1: Pythonによる厳密な数値計算 ---
        # ここに将来的に複雑な数理モデル（モンテカルロ法など）を追加可能です。
        
        # 仮のロジック: 生活防衛資金を「生活費20万 × 3ヶ月 = 60万円」と定義
        REQUIRED_EMERGENCY_FUND = 600000
        
        is_safe = data.bank_balance >= REQUIRED_EMERGENCY_FUND
        
        # 投資可能額の算出
        if is_safe:
            # 安全圏なら、余剰資金は全額投資へ（さらに貯金から回す判定も可）
            suggested_invest = data.monthly_surplus
            suggested_keep = 0
            financial_status = "安全圏"
        else:
            # 危険域なら、投資は0円。全額貯金へ。
            suggested_invest = 0
            suggested_keep = data.monthly_surplus
            financial_status = "資金不足（生活防衛資金を優先すべき）"

        # --- step 2: Geminiによるアドバイス生成 ---
        # 計算済みの数値を渡すことで、AIの計算ミスを防ぎます。
        
        model = genai.GenerativeModel(
            'gemini-3-flash-preview',
            generation_config={"response_mime_type": "application/json"}
        )

        system_prompt = f"""
        あなたはプロのFPです。以下の計算結果に基づき、JSON形式でアドバイスを生成してください。
        
        ## ユーザー状況
        - 資産状況: {financial_status}
        - 銀行残高: {data.bank_balance}円
        - 今月の余剰: {data.monthly_surplus}円
        
        ## Pythonによる計算結果（この数値に従ってください）
        - 投資すべき金額: {suggested_invest}円
        - 手元に残すべき金額: {suggested_keep}円
        
        ## 指示
        - 投資対象は「eMAXIS Slim 全世界株式（オール・カントリー）」としてください。
        - 投資額が0円の場合は、なぜ貯金すべきなのかを厳しく諭してください。
        - 投資額がある場合は、背中を押すような力強い指示を出してください。
        
        ## 出力スキーマ
        {{
            "invest_amount": int,
            "target_name": str,
            "keep_amount": int,
            "advice": str
        }}
        """

        response = model.generate_content(system_prompt)
        result_json = json.loads(response.text)

        return result_json

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)