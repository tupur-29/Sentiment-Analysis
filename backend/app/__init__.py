"""
Backend application initialization.
Provides package-level imports and version information.
"""

__version__ = "1.0.0"

from .core.config import settings
from .core.security import get_current_user, create_access_token
from .utils.sentiment import analyze_text, batch_analyze_texts
from .models.schemas import (
    SentimentResult,
    SentimentResponse,
    UserResponse,
    Token
)

__all__ = [
    # Version
    "__version__",
    
    # Core exports
    "settings",
    "get_current_user",
    "create_access_token",
    
    # Utils
    "analyze_text",
    "batch_analyze_texts",
    
    # Schemas
    "SentimentResult",
    "SentimentResponse",
    "UserResponse",
    "Token"
]
