"""
Test package initialization.
Provides common test fixtures and utilities.
"""

import pytest
from fastapi.testclient import TestClient
from typing import Generator

from app.main import app
from app.core.config import settings

# Test client fixture
@pytest.fixture(scope="session")
def client() -> Generator:
    """
    Create a FastAPI TestClient that will be used by all tests.
    """
    with TestClient(app) as test_client:
        yield test_client

# Test credentials
TEST_CREDENTIALS = {
    "username": "testuser",
    "password": "testpassword"
}

@pytest.fixture(scope="session")
def auth_headers(client: TestClient) -> dict:
    """
    Get authentication headers for protected endpoints.
    """
    response = client.post("/token", data=TEST_CREDENTIALS)
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

# Test data
TEST_CSV_CONTENT = (
    "id,text,timestamp\n"
    "1,I love this product!,2024-03-15 10:00:00\n"
    "2,The service was okay,2024-03-15 11:30:00\n"
    "3,I am not happy with the changes,2024-03-15 12:45:00"
)
