# BhavSpeak AI - Complete Setup Guide

## Quick Start

### Option 1: Supabase Setup (Recommended - Easiest)

See **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** for complete Supabase setup guide.

**Quick Steps:**
1. Create account at https://supabase.com
2. Create new project
3. Run `database/supabase-schema.sql` in Supabase SQL Editor
4. Copy database credentials to `backend/.env`
5. Start backend: `cd backend && npm install && npm run dev`

### Option 2: Local PostgreSQL Setup

#### Install PostgreSQL
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql && brew services start postgresql`
- **Linux**: `sudo apt install postgresql postgresql-contrib`

#### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Run these commands in psql:
CREATE DATABASE bhavspeak_ai;
\c bhavspeak_ai
\i database/schema.sql
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file (copy from env.example.txt)
# Edit .env with your database credentials

npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
# From project root
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## Environment Variables

### For Supabase (Recommended)
Create `backend/.env` file:

```env
PORT=3001
NODE_ENV=development

# Supabase Database Configuration
SUPABASE_DB_HOST=db.xxxxx.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your_supabase_password

JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

### For Local PostgreSQL
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bhavspeak_ai
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

## Testing Voice Recording

**Note: Pretest minimum duration is now 30 seconds for testing purposes**

1. Make sure you're using HTTPS or localhost (required for microphone access)
2. Browser will prompt for microphone permission - click "Allow"
3. Check browser console for any errors
4. Test recording by clicking "Start Recording" button
5. Record for at least 30 seconds (minimum requirement)
6. Click "Stop Recording" then "Submit Pretest"

## Troubleshooting

### Voice Recording Not Working
- Check browser console for errors
- Ensure microphone permission is granted
- Use HTTPS or localhost (not IP address)
- Check if microphone is working in other apps

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `.env` file
- Test connection: `psql -U postgres -d bhavspeak_ai`

### Submit Button Not Working
- Check browser console for errors
- Verify transcript is being captured (check the transcript display)
- Ensure recording duration meets minimum requirement (30 seconds for testing)

## API Integration

The frontend currently uses localStorage. To integrate with backend:

1. Update `src/context/AuthContext.tsx` to use API calls
2. Replace localStorage with API endpoints
3. Add API base URL to environment variables

Example API call:
```javascript
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

