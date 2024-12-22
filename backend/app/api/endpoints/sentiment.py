from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from typing import List
from datetime import datetime
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import io
import logging
from ...core.security import get_current_user
from ...schemas.sentiment import SentimentResponse, SentimentResult

# Configure logging with more detailed format
logger = logging.getLogger(__name__)

# Constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_MIME_TYPES = ['text/csv', 'application/csv']
MAX_ROWS = 1000  # Maximum number of rows to process

# Initialize router and VADER analyzer
router = APIRouter(
    prefix="/sentiment",
    tags=["sentiment"],
    responses={404: {"description": "Not found"}}
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
analyzer = SentimentIntensityAnalyzer()

@router.post("/analyze", 
    response_model=SentimentResponse,
    responses={
        200: {
            "description": "Successful analysis",
            "content": {
                "application/json": {
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
            }
        },
        400: {"description": "Invalid input"},
        401: {"description": "Authentication required"},
        500: {"description": "Internal server error"}
    }
)
async def analyze_sentiment(
    file: UploadFile = File(..., description="CSV file with columns: id, text, timestamp(optional)"),
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze sentiment from uploaded CSV file.
    
    The CSV file should contain the following columns:
    - id: Unique identifier for each entry
    - text: The text content to analyze
    - timestamp: (Optional) Date and time of text creation
    
    Example CSV format:
    ```
    id,text,timestamp
    1,"I love the new features!",2024-03-15 10:00:00
    2,"The service was okay",2024-03-15 11:30:00
    ```
    """
    try:
        # Validate file type
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}"
            )

        # Read file contents
        contents = await file.read()
        
        # Check file size
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum limit of {MAX_FILE_SIZE/1024/1024}MB"
            )

        # Process CSV
        try:
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="File must be UTF-8 encoded")
        except pd.errors.EmptyDataError:
            raise HTTPException(status_code=400, detail="File is empty")
        
        # Check row limit
        if len(df) > MAX_ROWS:
            raise HTTPException(
                status_code=400,
                detail=f"Number of rows exceeds maximum limit of {MAX_ROWS}"
            )
        
        # Validate required columns
        required_columns = ['id', 'text']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_columns)}"
            )
        
        # Validate data types and content
        if not df['id'].apply(lambda x: str(x).strip()).all():
            raise HTTPException(status_code=400, detail="Invalid or empty ID values")
        if not df['text'].apply(lambda x: str(x).strip()).all():
            raise HTTPException(status_code=400, detail="Invalid or empty text values")
        
        # Process timestamp column if present
        if 'timestamp' in df.columns:
            try:
                df['timestamp'] = pd.to_datetime(df['timestamp'])
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid timestamp format")
        
        results = []
        for _, row in df.iterrows():
            text = str(row['text']).strip()
            sentiment_scores = analyzer.polarity_scores(text)
            
            # Determine overall sentiment
            if sentiment_scores['compound'] >= 0.05:
                sentiment = 'positive'
            elif sentiment_scores['compound'] <= -0.05:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
                
            result = SentimentResult(
                id=str(row['id']).strip(),
                text=text,
                timestamp=row.get('timestamp', datetime.now()).isoformat(),
                sentiment=sentiment,
                sentiment_scores=sentiment_scores
            )
            results.append(result)
        
        logger.info(
            f"Successfully analyzed {len(results)} entries for user {current_user['username']}. "
            f"File size: {len(contents)/1024:.2f}KB"
        )
        
        return SentimentResponse(
            status="success",
            analyzed_entries=len(results),
            results=results
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing file for user {current_user['username']}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error occurred")

@router.get("/health", 
    responses={
        200: {"description": "Service is healthy"},
        500: {"description": "Service is unhealthy"}
    }
)
async def health_check():
    """Health check endpoint to verify API status"""
    try:
        analyzer.polarity_scores("test")
        return {
            "status": "healthy",
            "analyzer": "operational"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Service is unhealthy")
