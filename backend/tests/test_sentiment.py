import io
import pytest
from fastapi.testclient import TestClient
from datetime import datetime

from app.main import app
from app.core.config import settings
from app.models.schemas import SentimentResponse

# Initialize test client
client = TestClient(app)

# Test data
VALID_CREDENTIALS = {
    "username": "testuser",
    "password": "testpassword"
}

@pytest.fixture
def auth_headers():
    """Fixture to get authentication headers"""
    response = client.post("/token", data=VALID_CREDENTIALS)
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_analyze_sentiment_valid_csv(auth_headers):
    """Test sentiment analysis with valid CSV file"""
    csv_content = (
        "id,text,timestamp\n"
        "1,I love this product!,2024-03-15 10:00:00\n"
        "2,The service was okay,2024-03-15 11:30:00\n"
        "3,I am not happy with the changes,2024-03-15 12:45:00"
    )
    
    files = {
        "file": ("test.csv", io.StringIO(csv_content), "text/csv")
    }
    
    response = client.post(
        f"{settings.API_V1_PREFIX}/sentiment/analyze",
        files=files,
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Validate response structure
    assert isinstance(data, dict)
    assert "status" in data
    assert "analyzed_entries" in data
    assert "results" in data
    
    # Validate response content
    assert data["status"] == "success"
    assert data["analyzed_entries"] == 3
    assert len(data["results"]) == 3
    
    # Validate sentiment results
    results = data["results"]
    assert results[0]["sentiment"] == "positive"  # "I love this product!"
    assert results[1]["sentiment"] == "neutral"   # "The service was okay"
    assert results[2]["sentiment"] == "negative"  # "I am not happy"

def test_analyze_sentiment_invalid_csv(auth_headers):
    """Test sentiment analysis with invalid CSV structure"""
    csv_content = "invalid_column,text\n1,Hello"
    files = {
        "file": ("test.csv", io.StringIO(csv_content), "text/csv")
    }
    
    response = client.post(
        f"{settings.API_V1_PREFIX}/sentiment/analyze",
        files=files,
        headers=auth_headers
    )
    
    assert response.status_code == 400
    assert "Missing required columns" in response.json()["detail"]

def test_analyze_sentiment_empty_csv(auth_headers):
    """Test sentiment analysis with empty CSV"""
    files = {
        "file": ("test.csv", io.StringIO(""), "text/csv")
    }
    
    response = client.post(
        f"{settings.API_V1_PREFIX}/sentiment/analyze",
        files=files,
        headers=auth_headers
    )
    
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()

def test_analyze_sentiment_invalid_file_type(auth_headers):
    """Test sentiment analysis with non-CSV file"""
    files = {
        "file": ("test.txt", io.StringIO("some text"), "text/plain")
    }
    
    response = client.post(
        f"{settings.API_V1_PREFIX}/sentiment/analyze",
        files=files,
        headers=auth_headers
    )
    
    assert response.status_code == 400
    assert "file type" in response.json()["detail"].lower()

def test_analyze_sentiment_unauthenticated():
    """Test sentiment analysis without authentication"""
    csv_content = "id,text\n1,Hello world"
    files = {
        "file": ("test.csv", io.StringIO(csv_content), "text/csv")
    }
    
    response = client.post(
        f"{settings.API_V1_PREFIX}/sentiment/analyze",
        files=files
    )
    
    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]

def test_analyze_sentiment_invalid_token():
    """Test sentiment analysis with invalid token"""
    csv_content = "id,text\n1,Hello world"
    files = {
        "file": ("test.csv", io.StringIO(csv_content), "text/csv")
    }
    
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.post(
        f"{settings.API_V1_PREFIX}/sentiment/analyze",
        files=files,
        headers=headers
    )
    
    assert response.status_code == 401
    assert "Could not validate credentials" in response.json()["detail"]

def test_health_check():
    """Test health check endpoint"""
    response = client.get(f"{settings.API_V1_PREFIX}/sentiment/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
