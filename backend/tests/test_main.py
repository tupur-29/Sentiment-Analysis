import pytest
from fastapi.testclient import TestClient
from datetime import datetime

from app.main import app
from app.core.config import settings

# Initialize test client
client = TestClient(app)

def test_root_endpoint():
    """Test root endpoint returns correct API information"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    
    # Verify response structure
    assert "message" in data
    assert "version" in data
    assert "docs_url" in data
    
    # Verify content
    assert data["version"] == settings.APP_VERSION
    assert "/docs" in data["docs_url"]

def test_health_check():
    """Test basic health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    
    # Verify response
    assert data["status"] == "healthy"
    assert data["version"] == settings.APP_VERSION

def test_cors_headers():
    """Test CORS headers are properly set"""
    response = client.options("/",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET"
        }
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
    assert "access-control-allow-methods" in response.headers
    assert "access-control-allow-headers" in response.headers

def test_api_docs_available():
    """Test API documentation endpoints are accessible"""
    # Test Swagger UI
    response = client.get("/docs")
    assert response.status_code == 200
    assert "swagger" in response.text.lower()
    
    # Test ReDoc
    response = client.get("/redoc")
    assert response.status_code == 200
    assert "redoc" in response.text.lower()

def test_invalid_endpoint():
    """Test handling of invalid endpoints"""
    response = client.get("/nonexistent")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "not found" in data["detail"].lower()

@pytest.mark.asyncio
async def test_startup_event():
    """Test application startup configuration"""
    # This is a basic test to ensure the app starts
    # In a real scenario, you might want to mock Redis and test its initialization
    assert app.state
    
    # Verify CORS middleware is configured
    assert any(
        middleware.__class__.__name__ == "CORSMiddleware" 
        for middleware in app.middleware
    )
    
    # Verify routes are registered
    all_routes = [route.path for route in app.routes]
    assert "/" in all_routes
    assert "/health" in all_routes
    assert f"{settings.API_V1_PREFIX}/sentiment/analyze" in all_routes
