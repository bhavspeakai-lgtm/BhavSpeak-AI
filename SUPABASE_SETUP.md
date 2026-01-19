# Supabase Setup Guide for BhavSpeak AI

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: BhavSpeak AI (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine for testing

## Step 2: Get Database Credentials

1. In your Supabase project dashboard, go to **Settings** > **Database**
2. Scroll down to **Connection string** section
3. Copy the following values:
   - **Host**: `db.xxxxx.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: The one you set when creating the project

## Step 3: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `database/supabase-schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

## Step 4: Configure Backend

1. Navigate to `backend` folder
2. Create `.env` file:
```bash
cd backend
cp env.example.txt .env
```

3. Edit `.env` file with your Supabase credentials:
```env
PORT=3001
NODE_ENV=development

# Supabase Database Configuration
SUPABASE_DB_HOST=db.xxxxx.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your_supabase_password_here

JWT_SECRET=your_random_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

## Step 5: Install and Start Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ Database connected successfully
📦 Connected to Supabase
🚀 Server running on port 3001
```

## Step 6: Verify Setup

### Test Database Connection
```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","message":"BhavSpeak AI Backend is running"}
```

### Test Registration
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

## Viewing Data in Supabase

1. Go to **Table Editor** in Supabase dashboard
2. You should see all your tables:
   - users
   - user_progress
   - completed_lessons
   - pretest_results
   - etc.

## Troubleshooting

### Connection Error
- Double-check your credentials in `.env`
- Make sure you're using the correct host (should end with `.supabase.co`)
- Verify SSL is enabled (it's automatic with Supabase)

### SSL Error
- Supabase requires SSL connections
- The code already handles this with `rejectUnauthorized: false`
- If you still get errors, check your network/firewall

### Schema Errors
- Make sure you ran the entire `supabase-schema.sql` file
- Check SQL Editor for any error messages
- Some errors might be expected if tables already exist

### Port Already in Use
- Change PORT in `.env` file
- Or stop the process using port 3001

## Supabase Dashboard Features

- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom queries
- **API**: Auto-generated REST API (optional to use)
- **Auth**: Built-in authentication (optional to use)
- **Storage**: File storage (for future features)

## Production Notes

For production:
1. Use environment variables for all secrets
2. Set up proper CORS origins
3. Use strong JWT_SECRET
4. Enable Row Level Security policies if needed
5. Set up database backups in Supabase dashboard

## Quick Reference

**Supabase Dashboard**: https://app.supabase.com
**Documentation**: https://supabase.com/docs
**Connection Info**: Settings > Database > Connection string

