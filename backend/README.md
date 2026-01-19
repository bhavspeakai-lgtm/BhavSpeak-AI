# BhavSpeak AI Backend API

RESTful API backend for BhavSpeak AI language learning platform.

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "dob": "1990-01-01",
  "gender": "male",
  "phoneNumber": "1234567890"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "pretestCompleted": false
  },
  "token": "jwt_token"
}
```

#### POST `/api/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "pretestCompleted": true,
    "pretestLevel": "L2",
    "pretestScore": 75
  },
  "token": "jwt_token"
}
```

### Pretest

#### POST `/api/pretest/submit`
Submit pretest result. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "topicId": "self-intro",
  "transcript": "My name is...",
  "duration": 180,
  "score": 75,
  "level": "L2",
  "feedback": "Good job!"
}
```

#### GET `/api/pretest/result`
Get user's pretest result. Requires authentication.

### Practice

#### POST `/api/practice/phonetic`
Save phonetic practice result.

**Request Body:**
```json
{
  "soundId": "i",
  "wordId": "see",
  "userTranscript": "see",
  "isCorrect": true,
  "confidence": 0.95
}
```

#### POST `/api/practice/sentence-reading`
Save sentence reading result.

**Request Body:**
```json
{
  "lessonId": "sent-2-3-1",
  "sentenceId": "s1",
  "userTranscript": "The cat sat...",
  "mistakes": [],
  "score": 90
}
```

#### POST `/api/practice/speaking`
Save speaking practice result.

**Request Body:**
```json
{
  "topicId": "topic-1",
  "transcript": "My daily routine...",
  "duration": 120,
  "score": 80,
  "feedback": "Good fluency!"
}
```

#### POST `/api/practice/interview/answer`
Save AI interview answer.

**Request Body:**
```json
{
  "questionId": "q1",
  "answerTranscript": "I am...",
  "duration": 45
}
```

#### POST `/api/practice/interview/assessment`
Save final interview assessment.

**Request Body:**
```json
{
  "overallScore": 85,
  "fluencyScore": 90,
  "grammarScore": 80,
  "vocabularyScore": 85,
  "pronunciationScore": 85,
  "feedback": "Excellent performance!"
}
```

### User Progress

#### GET `/api/progress`
Get user progress. Requires authentication.

#### PUT `/api/progress`
Update user progress. Requires authentication.

**Request Body:**
```json
{
  "accent": "american",
  "level": "medium",
  "currentModule": "phonetic-sounds",
  "xp": 500,
  "streak": 5
}
```

#### POST `/api/progress/lessons/complete`
Mark lesson as completed. Requires authentication.

**Request Body:**
```json
{
  "lessonId": "phonetic-i",
  "moduleId": "phonetic-sounds",
  "score": 100
}
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

Status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

