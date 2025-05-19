# Sentiment Analysis API with React Portal

A FastAPI application that performs sentiment analysis on text data using a pre-trained model, paired with a React portal for uploading reports and visualizing sentiment analysis results.

## Features

- Sentiment analysis using pre-trained model
- CSV report upload functionality
- Visual representation of analysis results
- Basic authentication system
- Interactive data visualization (Bar & Pie charts)

## Tech Stack

### Backend
- FastAPI (Python)
- Pre-trained sentiment analysis model
- JWT for authentication
- Pandas for CSV processing

### Frontend (React Portal)
- React.js
- Chart.js for visualizations
- React Router for navigation
- Basic responsive design

## Setup Instructions

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Create and activate virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Create .env file (copy from .env.example)
```bash
cp .env.example .env
```

5. Start the backend server
```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create .env file (copy from .env.example)
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm run dev
```

## API Documentation

### Authentication

#### Login
```http
POST /token
Content-Type: application/x-www-form-urlencoded

username=testuser&password=testpassword
```

Response:
```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer"
}
```

### Sentiment Analysis

#### Analyze CSV File
```http
POST /api/v1/sentiment/analyze
Authorization: Bearer <your-token>
Content-Type: multipart/form-data

file: your-file.csv
```

Response:
```json
{
    "detail": "Analysis completed successfully",
    "results": {
        "positive": 2,
        "neutral": 1,
        "negative": 2,
        "total": 5
    }
}
```

## CSV File Format

Your CSV file should follow this format:

```csv
id,text,timestamp
1,"I love this product! The features are amazing.",2024-01-15 10:00:00
2,"The service was okay, nothing special to mention.",2024-01-15 11:30:00
3,"Very disappointed with the quality, would not recommend.",2024-01-15 12:45:00
```

Required columns:
- id: Unique identifier
- text: The text to analyze
- timestamp (optional): Timestamp of the entry

## Example Usage

1. Start both backend and frontend servers
2. Visit http://localhost:3000
3. Login with test credentials:
   - Username: testuser
   - Password: testpassword
4. Upload a CSV file following the format above
5. View the sentiment analysis results in:
   - Bar chart
   - Pie chart
   - Statistical summary

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (invalid file format)
- 401: Unauthorized
- 422: Validation Error
- 500: Server Error

## Security

- JWT-based authentication
- Password hashing
- CORS protection
- File validation
- Request rate limiting

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Environment Variables

Backend (.env):
```plaintext
SECRET_KEY=your-secret-key
TEST_USER=testuser
TEST_PASSWORD=testpassword
```

Frontend (.env):
```plaintext
VITE_API_URL=http://localhost:8000
```
## License

This project is licensed under the MIT License - see the LICENSE file for details.
