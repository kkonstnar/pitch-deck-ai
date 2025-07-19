# 🛠️ Setup & Deployment Guide

This guide will walk you through setting up Pitch Deck AI from scratch, including local development and production deployment.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Production Deployment](#production-deployment)
6. [Verification & Testing](#verification--testing)
7. [Maintenance](#maintenance)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed and configured:

### Required Software
- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))

### Required Accounts
- **GitHub Account**: For code repository and deployments
- **Supabase Account**: For database and authentication ([Sign up](https://supabase.com))
- **OpenAI Account**: For AI API access ([Sign up](https://platform.openai.com))
- **Vercel Account**: For frontend deployment ([Sign up](https://vercel.com))
- **Render Account**: For backend deployment ([Sign up](https://render.com))

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/kkonstnar/pitch-deck-ai.git
cd pitch-deck-ai

# Verify the project structure
ls -la
```

Expected structure:
```
pitch-deck-ai/
├── app/                    # Next.js app directory
├── backend/                # NestJS backend
│   └── pitch-deck-backend/
├── components/             # React components
├── docs/                   # Documentation
├── utils/                  # Utility functions
├── package.json           # Frontend dependencies
└── README.md
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend/pitch-deck-backend
npm install
cd ../..
```

### 3. Set Up Environment Files

```bash
# Frontend environment
cp .env.example .env.local

# Backend environment
cp backend/pitch-deck-backend/.env.example backend/pitch-deck-backend/.env
```

## ⚙️ Environment Configuration

### Frontend Environment (`.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

### Backend Environment (`backend/pitch-deck-backend/.env`)

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### How to Get Your API Keys

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (2-3 minutes)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Starts with `eyJ...`
   - **service_role key**: Starts with `eyJ...` (keep this secret!)

#### OpenAI Setup
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)
6. **Important**: Add billing information to avoid rate limits

## 🗄️ Database Setup

### 1. Create Supabase Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the following SQL:

```sql
-- Create users table (if not using Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pitch_decks table
CREATE TABLE pitch_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  target_audience VARCHAR(255) NOT NULL,
  funding_goal DECIMAL(15, 2),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create slides table
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_deck_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  slide_type VARCHAR(100) NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (pitch_deck_id) REFERENCES pitch_decks(id) ON DELETE CASCADE
);

-- Create slide_versions table for version control
CREATE TABLE slide_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_id UUID NOT NULL,
  content JSONB NOT NULL,
  version_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (slide_id) REFERENCES slides(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_pitch_decks_user_id ON pitch_decks(user_id);
CREATE INDEX idx_slides_pitch_deck_id ON slides(pitch_deck_id);
CREATE INDEX idx_slides_position ON slides(position);
CREATE INDEX idx_slide_versions_slide_id ON slide_versions(slide_id);

-- Enable Row Level Security
ALTER TABLE pitch_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE slide_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own pitch decks" ON pitch_decks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pitch decks" ON pitch_decks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pitch decks" ON pitch_decks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pitch decks" ON pitch_decks
  FOR DELETE USING (auth.uid() = user_id);

-- Slides policies
CREATE POLICY "Users can view slides of their pitch decks" ON slides
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pitch_decks
      WHERE pitch_decks.id = slides.pitch_deck_id
      AND pitch_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert slides to their pitch decks" ON slides
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pitch_decks
      WHERE pitch_decks.id = slides.pitch_deck_id
      AND pitch_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update slides of their pitch decks" ON slides
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pitch_decks
      WHERE pitch_decks.id = slides.pitch_deck_id
      AND pitch_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete slides of their pitch decks" ON slides
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM pitch_decks
      WHERE pitch_decks.id = slides.pitch_deck_id
      AND pitch_decks.user_id = auth.uid()
    )
  );

-- Slide versions policies
CREATE POLICY "Users can view slide versions of their slides" ON slide_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM slides
      JOIN pitch_decks ON pitch_decks.id = slides.pitch_deck_id
      WHERE slides.id = slide_versions.slide_id
      AND pitch_decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert slide versions to their slides" ON slide_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM slides
      JOIN pitch_decks ON pitch_decks.id = slides.pitch_deck_id
      WHERE slides.id = slide_versions.slide_id
      AND pitch_decks.user_id = auth.uid()
    )
  );
```

3. Click **"RUN"** to execute the SQL

### 2. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Enable the following providers as needed:
   - Email/Password (enabled by default)
   - OAuth providers (Google, GitHub, etc.)
3. Configure email templates if desired

## 🚀 Production Deployment

### Step 1: Prepare for Deployment

```bash
# Test local builds
npm run build                                    # Frontend build
cd backend/pitch-deck-backend && npm run build  # Backend build
```

### Step 2: Deploy Backend to Render

1. **Create Render Account** at [render.com](https://render.com)

2. **Connect GitHub Repository**:
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub account
   - Select the `pitch-deck-ai` repository

3. **Configure Service**:
   - **Name**: `pitch-deck-backend`
   - **Root Directory**: `backend/pitch-deck-backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free (or paid for production)

4. **Add Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=10000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   OPENAI_API_KEY=your_openai_api_key
   ```

5. **Deploy**: Click **"Create Web Service"**

6. **Note the URL**: Save the deployment URL (e.g., `https://pitch-deck-backend.onrender.com`)

### Step 3: Deploy Frontend to Vercel

1. **Create Vercel Account** at [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click **"New Project"**
   - Import from GitHub: Select `pitch-deck-ai`
   - **Root Directory**: Leave as `/` (default)
   - **Framework Preset**: Next.js (auto-detected)

3. **Add Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com/api
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Deploy**: Click **"Deploy"**

5. **Note the URL**: Save the deployment URL (e.g., `https://pitch-deck-ai-xxx.vercel.app`)

### Step 4: Update CORS Configuration

1. **In Render Dashboard**:
   - Go to your backend service
   - **Environment** → Add variable:
     ```env
     FRONTEND_URL=https://your-vercel-url.vercel.app
     ```
   - Save (triggers automatic redeploy)

## ✅ Verification & Testing

### 1. Test Backend API

```bash
# Test health endpoint
curl https://your-backend.onrender.com/api

# Test auth endpoint
curl -X POST https://your-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

### 2. Test Frontend Application

1. **Visit your deployed app**: `https://your-app.vercel.app`
2. **Test user registration**: Create a new account
3. **Test pitch deck creation**: Generate a simple pitch deck
4. **Test AI features**: Use the chat assistant
5. **Test export**: Download PDF and PPTX files

### 3. Monitor Deployments

- **Render**: Check logs for backend issues
- **Vercel**: Monitor build logs and function execution
- **Supabase**: Check database connections and queries

## 🔧 Maintenance

### Regular Updates

```bash
# Update dependencies (monthly)
npm update                                        # Frontend
cd backend/pitch-deck-backend && npm update      # Backend

# Security updates (as needed)
npm audit fix                                     # Frontend
cd backend/pitch-deck-backend && npm audit fix   # Backend
```

### Monitoring

1. **Render Dashboard**: Monitor backend uptime and logs
2. **Vercel Analytics**: Track frontend performance
3. **Supabase Dashboard**: Monitor database usage
4. **OpenAI Usage**: Track API consumption and costs

### Backup Strategy

1. **Database**: Supabase provides automatic backups
2. **Code**: GitHub serves as code backup
3. **Environment Variables**: Keep secure backup of all keys

### Cost Optimization

1. **Render**: Free tier sufficient for development
2. **Vercel**: Free tier covers most usage
3. **Supabase**: Monitor database size and API calls
4. **OpenAI**: Monitor token usage and set limits

## 🚨 Troubleshooting

### Common Issues

#### "API Key Not Found" Errors
- **Solution**: Verify all environment variables are set correctly
- **Check**: Redeploy after adding environment variables

#### CORS Errors
- **Solution**: Ensure `FRONTEND_URL` is set in backend environment
- **Check**: Frontend URL matches exactly (no trailing slash)

#### Database Connection Issues
- **Solution**: Verify Supabase credentials and run the SQL migration
- **Check**: Row Level Security policies are correctly configured

#### Build Failures
- **Solution**: Check Node.js version compatibility
- **Check**: All dependencies are correctly installed

### Getting Help

1. **Check Logs**: Always check deployment logs first
2. **GitHub Issues**: Search existing issues or create new one
3. **Discord/Slack**: Join community channels for real-time help
4. **Documentation**: Re-read relevant sections

---

## 🎉 Congratulations!

You now have a fully functional Pitch Deck AI application running in production! 

**Next Steps**:
- Customize the UI to match your brand
- Add additional AI features
- Set up monitoring and analytics
- Scale based on user feedback

**Need Help?** Check out our [Troubleshooting Guide](./TROUBLESHOOTING.md) or open an issue on GitHub.