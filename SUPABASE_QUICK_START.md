# Supabase Quick Start - Your Project

## Your Supabase Details
- **Project URL**: https://rmracaakljhvwpmfpxmw.supabase.co
- **Project Ref**: rmracaakljhvwpmfpxmw
- **Database Host**: db.rmracaakljhvwpmfpxmw.supabase.co

## Step 1: Get Database Password

1. Go to your Supabase Dashboard: https://app.supabase.com/project/rmracaakljhvwpmfpxmw
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **Database password** section
4. If you forgot it, click **Reset database password** (or use the one you set when creating the project)
5. Copy the password

## Step 2: Update Backend .env File

The `.env` file has been created. Update the database password:

```env
SUPABASE_DB_PASSWORD=your_actual_database_password_here
```

## Step 3: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `database/supabase-schema.sql` from your project
4. Copy the entire file content
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

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

## Step 6: Test Connection

Open a new terminal and run:

```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","message":"BhavSpeak AI Backend is running"}
```

## Step 7: Test Registration

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

If successful, you'll get a response with user data and a JWT token.

## Verify Data in Supabase

1. Go to **Table Editor** in Supabase Dashboard
2. You should see tables:
   - users
   - user_progress
   - completed_lessons
   - pretest_results
   - etc.

## Troubleshooting

### Connection Error
- Double-check your database password in `.env`
- Make sure you're using: `db.rmracaakljhvwpmfpxmw.supabase.co` as the host

### Schema Errors
- Make sure you ran the entire `supabase-schema.sql` file
- Some "already exists" errors are okay if you ran it before

### Port Already in Use
- Change PORT in `.env` to something else like 3002

## Next Steps

1. Start frontend: `npm run dev` (from project root)
2. Test the application at http://localhost:5173
3. Sign up and test pretest recording (30 seconds minimum)

