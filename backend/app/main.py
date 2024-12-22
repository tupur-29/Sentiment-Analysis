from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from .core.config import settings
from .core.security import get_current_user, create_access_token
from .utils.sentiment import analyze_text
import pandas as pd
import logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Simple test user authentication
    if form_data.username == "testuser" and form_data.password == "testpassword":
        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password"
    )

@app.post("/api/v1/sentiment/analyze")
async def analyze_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    try:
        df = pd.read_csv(file.file)
        
        if 'text' not in df.columns:
            raise HTTPException(
                status_code=400,
                detail="CSV must contain 'text' column"
            )

        # Analyze sentiment for each text
        results = []
        for _, row in df.iterrows():
            sentiment = analyze_text(row['text'])
            results.append(sentiment)

        # Calculate statistics
        positive = sum(1 for r in results if r['sentiment'] == 'positive')
        neutral = sum(1 for r in results if r['sentiment'] == 'neutral')
        negative = sum(1 for r in results if r['sentiment'] == 'negative')
        
        return {
            "detail": "Analysis completed successfully",
            "results": {
                "positive": positive,
                "neutral": neutral,
                "negative": negative,
                "total": len(results)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
