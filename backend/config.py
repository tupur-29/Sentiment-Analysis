from pydantic import BaseSettings, validator
from typing import List, Optional
import secrets
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config(BaseSettings):
    # Application settings
    APP_NAME: str = "Sentiment Analysis API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    
    # Security settings
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # File upload settings
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS: List[str] = ["csv"]
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Redis settings
    REDIS_URL: str = "redis://localhost:6379"
    
    # Database settings
    DATABASE_URL: Optional[str] = None
    
    # Logging settings
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_FILE: str = "logs/api.log"
    
    # Test settings
    TEST_USER: str = "testuser"
    TEST_PASSWORD: str = "testpassword"

    @validator("SECRET_KEY", pre=True)
    def validate_secret_key(cls, v):
        if not v or len(v) < 32:
            return secrets.token_urlsafe(32)
        return v
    
    @validator("CORS_ORIGINS", pre=True)
    def validate_cors_origins(cls, v):
        if isinstance(v, str):
            if v == "*":
                return ["*"]
            return [i.strip() for i in v.split(",")]
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True
        
        # Example environment variables
        schema_extra = {
            "example": {
                "SECRET_KEY": "your-secret-key-at-least-32-characters",
                "CORS_ORIGINS": "http://localhost:3000,http://localhost:8000",
                "DATABASE_URL": "postgresql://user:password@localhost/dbname",
                "LOG_LEVEL": "INFO"
            }
        }

# Create config instance
config = Config()

# Validate critical settings
def validate_config():
    """Validate critical configuration settings"""
    assert config.SECRET_KEY, "SECRET_KEY must be set"
    assert len(config.SECRET_KEY) >= 32, "SECRET_KEY must be at least 32 characters"
    assert config.ALGORITHM in ["HS256", "HS384", "HS512"], "Invalid algorithm"
    assert config.ACCESS_TOKEN_EXPIRE_MINUTES > 0, "Invalid token expiration time"
    assert config.MAX_UPLOAD_SIZE > 0, "Invalid max upload size"

# Run validation
validate_config()
