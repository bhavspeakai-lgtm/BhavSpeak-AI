# BhavSpeak AI Database Setup Guide

## Prerequisites
- PostgreSQL 12 or higher installed
- Node.js 18 or higher installed

## Step 1: Install PostgreSQL

### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 2: Create Database

Open PostgreSQL command line (psql) and run:

```sql
-- Connect as postgres user
psql -U postgres

-- Create database
CREATE DATABASE bhavspeak_ai;

-- Create a new user (optional but recommended)
CREATE USER bhavspeak_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE bhavspeak_ai TO bhavspeak_user;

-- Connect to the new database
\c bhavspeak_ai

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO bhavspeak_user;
```

## Step 3: Run Schema

```bash
# From the project root directory
psql -U postgres -d bhavspeak_ai -f database/schema.sql
```

Or if using the new user:
```bash
psql -U bhavspeak_user -d bhavspeak_ai -f database/schema.sql
```

## Step 4: Setup Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bhavspeak_ai
DB_USER=bhavspeak_user  # or postgres
DB_PASSWORD=your_secure_password
JWT_SECRET=your_super_secret_jwt_key_change_this
CORS_ORIGIN=http://localhost:5173
```

## Step 5: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## Step 6: Verify Setup

1. Check database connection:
```bash
curl http://localhost:3001/health
```

2. Test registration endpoint:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "dob": "1990-01-01",
    "gender": "male",
    "phoneNumber": "1234567890"
  }'
```

## Database Schema Overview

- **users**: User accounts and authentication
- **user_progress**: Learning progress tracking
- **completed_lessons**: Completed lessons history
- **pretest_results**: Pretest assessment results
- **phonetic_practice_results**: Phonetic sound practice data
- **sentence_reading_results**: Sentence reading practice data
- **speaking_practice_results**: Speaking practice data
- **ai_interview_results**: AI interview answers
- **interview_assessments**: Final interview assessments

## Troubleshooting

### Connection refused:
- Make sure PostgreSQL is running: `sudo systemctl status postgresql` (Linux) or check Services (Windows)

### Authentication failed:
- Check username and password in `.env` file
- Verify user has proper permissions

### Database doesn't exist:
- Run the CREATE DATABASE command from Step 2

### Port already in use:
- Change PORT in `.env` file or stop the process using port 3001

## Production Deployment

For production:
1. Use environment variables for all sensitive data
2. Use a strong JWT_SECRET
3. Enable SSL for PostgreSQL connection
4. Set up proper backup strategy
5. Use connection pooling (already configured)
6. Set up proper CORS origins

