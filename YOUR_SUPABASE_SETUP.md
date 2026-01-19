# Your Supabase Setup - Quick Guide

## Your Supabase Credentials
- **Project URL**: https://rmracaakljhvwpmfpxmw.supabase.co
- **Project Ref**: rmracaakljhvwpmfpxmw
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcmFjYWFrbGpodndwbWZweG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzM2MzUsImV4cCI6MjA4NDQwOTYzNX0.c4nkpRL6IVimYwpuuqF26iKJvjdMdqA9arJQ2MJipkw
- **Database Host**: db.rmracaakljhvwpmfpxmw.supabase.co

## Step 1: Get Your Database Password

1. Go to: https://app.supabase.com/project/rmracaakljhvwpmfpxmw
2. Click **Settings** (⚙️ icon) → **Database**
3. Scroll to **Database password** section
4. If you remember it, use that. If not, click **Reset database password**
5. **Copy the password** - you'll need it for the .env file

## Step 2: Create Backend .env File

Create `backend/.env` file with this content:

```env
PORT=3001
NODE_ENV=development

# Supabase Database Configuration
SUPABASE_DB_HOST=db.rmracaakljhvwpmfpxmw.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=YOUR_DATABASE_PASSWORD_HERE

# JWT Secret (use a random string)
JWT_SECRET=bhavspeak_ai_secret_key_12345

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Supabase URL and Anon Key
SUPABASE_URL=https://rmracaakljhvwpmfpxmw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcmFjYWFrbGpodndwbWZweG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzM2MzUsImV4cCI6MjA4NDQwOTYzNX0.c4nkpRL6IVimYwpuuqF26iKJvjdMdqA9arJQ2MJipkw

# OpenAI API (Optional)
OPENAI_API_KEY=your_openai_api_key_here
```

**Important**: Replace `YOUR_DATABASE_PASSWORD_HERE` with the password from Step 1!

## Step 3: Run Database Schema in Supabase

1. Go to: https://app.supabase.com/project/rmracaakljhvwpmfpxmw/sql/new
2. Open `database/supabase-schema.sql` file from your project
3. Copy **ALL** the content from that file
4. Paste it into the Supabase SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see: ✅ "Success. No rows returned"

## Step 4: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 5: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
📦 Connected to Supabase
🚀 Server running on port 3001
```

## Step 6: Test the Setup

### Test 1: Health Check
```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","message":"BhavSpeak AI Backend is running"}
```

### Test 2: Register a User
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

If successful, you'll get a response with user data and token.

## Step 7: Verify Tables Created

1. Go to: https://app.supabase.com/project/rmracaakljhvwpmfpxmw/editor
2. You should see these tables:
   - ✅ users
   - ✅ user_progress
   - ✅ completed_lessons
   - ✅ pretest_results
   - ✅ phonetic_practice_results
   - ✅ sentence_reading_results
   - ✅ speaking_practice_results
   - ✅ ai_interview_results
   - ✅ interview_assessments

## Troubleshooting

### "Connection refused" or "Connection timeout"
- Check your database password in `.env` file
- Make sure you're using: `db.rmracaakljhvwpmfpxmw.supabase.co` (not the project URL)
- Verify your internet connection

### "Authentication failed"
- Double-check the database password
- Make sure there are no extra spaces in `.env` file
- Try resetting the database password in Supabase dashboard

### "Table already exists" errors
- This is okay if you ran the schema before
- The schema uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times

### Port 3001 already in use
- Change PORT in `.env` to something else like 3002
- Or stop the process using port 3001

## Next Steps

Once backend is running:
1. Start frontend: `npm run dev` (from project root)
2. Open http://localhost:5173
3. Sign up and test pretest (30 seconds minimum recording)

## Quick Reference

- **Supabase Dashboard**: https://app.supabase.com/project/rmracaakljhvwpmfpxmw
- **SQL Editor**: https://app.supabase.com/project/rmracaakljhvwpmfpxmw/sql/new
- **Table Editor**: https://app.supabase.com/project/rmracaakljhvwpmfpxmw/editor
- **Database Settings**: https://app.supabase.com/project/rmracaakljhvwpmfpxmw/settings/database

