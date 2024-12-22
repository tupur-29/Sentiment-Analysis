from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)

class UserUpdate(UserBase):
    is_active: Optional[bool] = True

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

# Sentiment analysis schemas
class SentimentScores(BaseModel):
    neg: float = Field(..., ge=0, le=1)
    neu: float = Field(..., ge=0, le=1)
    pos: float = Field(..., ge=0, le=1)
    compound: float = Field(..., ge=-1, le=1)

class SentimentResult(BaseModel):
    id: str
    text: str
    timestamp: str
    sentiment: str = Field(..., regex="^(positive|negative|neutral)$")
    sentiment_scores: SentimentScores

class SentimentResponse(BaseModel):
    status: str = Field(..., regex="^(success|error)$")
    analyzed_entries: int = Field(..., ge=0)
    results: List[SentimentResult]

    class Config:
        schema_extra = {
            "example": {
                "status": "success",
                "analyzed_entries": 2,
                "results": [
                    {
                        "id": "1",
                        "text": "I love this product!",
                        "timestamp": "2024-03-15T10:00:00",
                        "sentiment": "positive",
                        "sentiment_scores": {
                            "neg": 0.0,
                            "neu": 0.242,
                            "pos": 0.758,
                            "compound": 0.6369
                        }
                    }
                ]
            }
        }

# Error schemas
class HTTPError(BaseModel):
    detail: str

    class Config:
        schema_extra = {
            "example": {"detail": "Error message"}
        }
