# 🔧 Troubleshooting Guide

Common issues and solutions for Pitch Deck AI.

## 🚨 Quick Fixes

### App Won't Load
1. **Check your internet connection**
2. **Clear browser cache and cookies**
3. **Try a different browser** (Chrome, Firefox, Safari)
4. **Disable browser extensions** temporarily
5. **Check if the app is down**: [Status Page](https://status.vercel.com)

### Login Issues
1. **Verify email and password** are correct
2. **Check for email verification** in your inbox
3. **Try password reset** if needed
4. **Clear browser storage**: DevTools → Application → Storage → Clear

### AI Features Not Working
1. **Check API status** in browser DevTools → Network tab
2. **Verify API keys** are configured (for self-hosted)
3. **Try again in a few minutes** (rate limiting)
4. **Contact support** if persistent

## 🛠️ Development Issues

### Local Setup Problems

#### Node.js Version Issues
**Problem**: `node: command not found` or version conflicts

**Solution**:
```bash
# Install Node.js 18+ from nodejs.org
# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### npm Install Failures
**Problem**: `npm ERR! peer dep missing` or similar

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use --legacy-peer-deps flag
npm install --legacy-peer-deps
```

#### Frontend Build Errors
**Problem**: `TypeError: Cannot read property` during build

**Solution**:
```bash
# Check TypeScript errors
npm run type-check

# Update dependencies
npm update

# Check environment variables
cat .env.local

# Ensure all required env vars are set
```

#### Backend Build Errors
**Problem**: NestJS compilation failures

**Solution**:
```bash
cd backend/pitch-deck-backend

# Install missing dependencies
npm install

# Check for TypeScript errors
npm run build

# Verify environment configuration
cat .env
```

### Environment Variable Issues

#### Missing API Keys
**Problem**: `API key not found` errors

**Solution**:
1. **Check `.env.local`** (frontend) and `.env`** (backend)
2. **Verify variable names** match exactly:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Restart development servers** after changes
4. **No spaces around `=`** in env files

#### Supabase Connection Issues
**Problem**: Database connection failures

**Solutions**:
1. **Verify Supabase URL** format: `https://xxx.supabase.co`
2. **Check API keys** are copied correctly (no extra spaces)
3. **Run database migration** SQL in Supabase dashboard
4. **Verify project is not paused** in Supabase

#### CORS Errors
**Problem**: `Access-Control-Allow-Origin` errors

**Solutions**:
1. **Check backend CORS configuration** in `main.ts`
2. **Verify frontend URL** matches `FRONTEND_URL` env var
3. **No trailing slashes** in URLs
4. **Restart backend** after env changes

## 🚀 Deployment Issues

### Vercel Deployment Problems

#### Build Failures
**Problem**: `Build failed` with various errors

**Solutions**:
1. **Check build logs** in Vercel dashboard
2. **Verify all environment variables** are set
3. **Test build locally**: `npm run build`
4. **Check Node.js version** in `package.json`:
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

#### Environment Variable Issues
**Problem**: `undefined` values in production

**Solutions**:
1. **Add all required variables** in Vercel dashboard
2. **Use correct prefixes**: `NEXT_PUBLIC_` for client-side variables
3. **Redeploy** after adding variables
4. **Check variable scoping**: Production, Preview, Development

#### Function Timeout
**Problem**: API routes timing out

**Solutions**:
1. **Check function duration** in Vercel analytics
2. **Optimize AI API calls** (reduce token limits)
3. **Upgrade Vercel plan** if needed
4. **Add timeout configuration** in `vercel.json`:
   ```json
   {
     "functions": {
       "app/api/*/route.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

### Render Deployment Problems

#### Build Failures
**Problem**: Backend build failing on Render

**Solutions**:
1. **Check build logs** in Render dashboard
2. **Verify build command**: `npm install && npm run build`
3. **Check start command**: `npm run start:prod`
4. **Verify Node.js version** compatibility

#### Environment Variables
**Problem**: Missing configuration in production

**Solutions**:
1. **Add all required variables** in Render dashboard
2. **No quotes** around values in Render UI
3. **Restart service** after adding variables
4. **Check for typos** in variable names

#### Memory Issues
**Problem**: Out of memory errors

**Solutions**:
1. **Upgrade Render plan** for more RAM
2. **Optimize dependencies** (remove unused packages)
3. **Add memory configuration**:
   ```json
   {
     "build": {
       "env": {
         "NODE_OPTIONS": "--max-old-space-size=1024"
       }
     }
   }
   ```

### Supabase Issues

#### Row Level Security (RLS) Errors
**Problem**: `Row Level Security policy violated`

**Solutions**:
1. **Run complete database migration** SQL
2. **Check user authentication** is working
3. **Verify policies** in Supabase dashboard → Authentication → Policies
4. **Test with Supabase SQL editor**:
   ```sql
   -- Check if policies exist
   SELECT * FROM pg_policies WHERE tablename = 'pitch_decks';
   
   -- Test policy function
   SELECT auth.uid();
   ```

#### Database Connection Issues
**Problem**: Connection timeouts or failures

**Solutions**:
1. **Check project status** in Supabase dashboard
2. **Verify connection strings** and API keys
3. **Check database usage** limits
4. **Restart Supabase project** if needed

## 🐛 Common Application Issues

### Authentication Problems

#### Login Failures
**Problem**: Users can't sign in

**Diagnostics**:
```bash
# Check browser console for errors
# Open DevTools → Console

# Common error messages:
# - "Invalid login credentials"
# - "Email not confirmed"
# - "Too many requests"
```

**Solutions**:
1. **Email verification**: Check spam folder, resend verification
2. **Password reset**: Use "Forgot Password" feature
3. **Rate limiting**: Wait 5-10 minutes before retrying
4. **Clear browser storage**: DevTools → Application → Storage

#### Session Persistence Issues
**Problem**: Users get logged out frequently

**Solutions**:
1. **Check JWT expiration** in Supabase settings
2. **Implement refresh token logic** (usually automatic)
3. **Verify secure cookie settings**
4. **Check browser privacy settings**

### AI Generation Issues

#### OpenAI API Errors
**Problem**: "Failed to generate content" errors

**Common Causes & Solutions**:

1. **Rate Limiting**:
   ```
   Error: "Rate limit exceeded"
   Solution: Wait 1 minute, try again
   ```

2. **API Key Issues**:
   ```
   Error: "Unauthorized"
   Solution: Verify API key, check billing
   ```

3. **Content Policy Violations**:
   ```
   Error: "Content filtered"
   Solution: Rephrase input, avoid sensitive topics
   ```

4. **Token Limits**:
   ```
   Error: "Token limit exceeded"
   Solution: Reduce input length, simplify requests
   ```

#### Slow AI Responses
**Problem**: Long wait times for generation

**Solutions**:
1. **Check OpenAI status**: [status.openai.com](https://status.openai.com)
2. **Reduce token limits** in API calls
3. **Simplify prompts** for faster processing
4. **Use GPT-3.5** instead of GPT-4 for speed

### Export Issues

#### PDF Export Problems
**Problem**: PDF generation fails or produces empty files

**Solutions**:
1. **Check browser compatibility** (Chrome recommended)
2. **Disable popup blockers** for downloads
3. **Clear browser cache** and try again
4. **Try smaller slide count** (reduce to 5-10 slides)

#### PPTX Export Problems
**Problem**: PowerPoint export fails

**Diagnostics**:
```bash
# Check network tab in DevTools
# Look for /api/export/pptx request
# Check response status and errors
```

**Solutions**:
1. **Verify backend is running** and accessible
2. **Check server logs** in Render dashboard
3. **Reduce slide content** size if timeout occurs
4. **Try again** (temporary server issues)

### Performance Issues

#### Slow Loading
**Problem**: App takes long time to load

**Solutions**:
1. **Check internet connection** speed
2. **Clear browser cache** and reload
3. **Disable unnecessary browser extensions**
4. **Try incognito/private mode**
5. **Check CDN status** for static assets

#### Memory Issues
**Problem**: Browser becomes slow or crashes

**Solutions**:
1. **Close other browser tabs**
2. **Restart browser**
3. **Check RAM usage** in Task Manager
4. **Use latest browser version**

## 🔍 Debugging Tips

### Browser Developer Tools

#### Console Debugging
```javascript
// Open browser console (F12)
// Look for error messages
// Common error patterns:

// Network errors
"Failed to fetch"
"CORS error"
"404 Not Found"

// JavaScript errors
"Cannot read property"
"undefined is not a function"
"ReferenceError"

// React errors
"Warning: Each child in a list should have a unique key"
"Cannot update a component while rendering"
```

#### Network Tab Debugging
1. **Open DevTools → Network**
2. **Reproduce the issue**
3. **Look for failed requests** (red status)
4. **Check request/response details**
5. **Verify API endpoints** and payloads

#### Application Tab Debugging
1. **Check Local Storage** for saved data
2. **Verify Session Storage** for auth tokens
3. **Clear storage** if corrupted
4. **Check Service Workers** status

### API Testing

#### Test Backend Endpoints
```bash
# Test health endpoint
curl https://pitch-deck-backend.onrender.com/api

# Test authentication
curl -X POST https://your-backend.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Test with authentication
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-backend.com/api/pitch-deck
```

#### Check Database Connectivity
```sql
-- In Supabase SQL Editor
-- Test basic query
SELECT NOW();

-- Test table existence
SELECT * FROM pitch_decks LIMIT 1;

-- Test RLS policies
SELECT auth.uid();
```

## 📞 Getting Additional Help

### Before Contacting Support

1. **Try incognito/private mode** to rule out browser issues
2. **Check status pages**:
   - [Vercel Status](https://www.vercel-status.com/)
   - [Render Status](https://status.render.com/)
   - [OpenAI Status](https://status.openai.com/)
   - [Supabase Status](https://status.supabase.com/)
3. **Gather error information**:
   - Browser console errors
   - Network request failures
   - Steps to reproduce
   - Operating system and browser version

### Support Channels

#### GitHub Issues
- **Bug reports**: [Create new issue](https://github.com/kkonstnar/pitch-deck-ai/issues/new)
- **Feature requests**: Use feature request template
- **Questions**: Check existing issues first

#### Community Support
- **Discussions**: [GitHub Discussions](https://github.com/kkonstnar/pitch-deck-ai/discussions)
- **Discord**: Community chat (link in README)
- **Stack Overflow**: Tag with `pitch-deck-ai`

#### Direct Support
- **Email**: support@pitchdeckai.com
- **Response time**: 24-48 hours
- **Include**: Error details, steps to reproduce, system info

### Information to Include

When reporting issues, provide:

1. **Environment Details**:
   - Operating System (Windows 10, macOS 12, Ubuntu 20.04)
   - Browser and version (Chrome 96, Firefox 95, Safari 15)
   - Screen resolution and device type

2. **Error Information**:
   - Exact error message
   - Browser console logs
   - Network request details
   - Screenshots or recordings

3. **Steps to Reproduce**:
   - What you were trying to do
   - Step-by-step actions
   - Expected vs actual behavior
   - Frequency (always, sometimes, once)

4. **Account Information** (if relevant):
   - User ID or email
   - Pitch deck ID
   - Timestamp of issue

---

**Still having issues?** Don't hesitate to reach out - we're here to help make your pitch deck creation experience smooth and successful!