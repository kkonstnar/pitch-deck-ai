# 📡 API Documentation

Complete documentation for the Pitch Deck AI backend API.

## 🌐 Base URL

- **Production**: `https://pitch-deck-backend.onrender.com/api`
- **Development**: `http://localhost:3001/api`

## 🔐 Authentication

The API uses Supabase authentication. Include the user's JWT token in requests:

```http
Authorization: Bearer <jwt_token>
```

## 📋 Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Pitch Deck Endpoints](#pitch-deck-endpoints)
3. [Export Endpoints](#export-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)

## 🔑 Authentication Endpoints

### POST /auth/signup

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

### POST /auth/signin

Sign in an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt_token",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

### POST /auth/signout

Sign out the current user.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Successfully signed out"
}
```

### GET /auth/user

Get current user information.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## 🎯 Pitch Deck Endpoints

### GET /pitch-deck

Get all pitch decks for the authenticated user.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `userId` (required): User ID

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "My Startup Pitch",
    "description": "Revolutionary SaaS platform",
    "company_name": "TechCorp",
    "industry": "saas",
    "target_audience": "B2B enterprises",
    "funding_goal": 1000000,
    "user_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST /pitch-deck

Create a new pitch deck.

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Startup Pitch",
  "description": "Revolutionary SaaS platform",
  "companyName": "TechCorp",
  "industry": "saas",
  "targetAudience": "B2B enterprises",
  "fundingGoal": 1000000,
  "userId": "uuid"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "title": "My Startup Pitch",
  "description": "Revolutionary SaaS platform",
  "company_name": "TechCorp",
  "industry": "saas",
  "target_audience": "B2B enterprises",
  "funding_goal": 1000000,
  "user_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### GET /pitch-deck/:id

Get a specific pitch deck by ID.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (required): Pitch deck ID

**Response (200):**
```json
{
  "id": "uuid",
  "title": "My Startup Pitch",
  "description": "Revolutionary SaaS platform",
  "company_name": "TechCorp",
  "industry": "saas",
  "target_audience": "B2B enterprises",
  "funding_goal": 1000000,
  "user_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### PATCH /pitch-deck/:id

Update a specific pitch deck.

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**
- `id` (required): Pitch deck ID

**Request Body:**
```json
{
  "title": "Updated Pitch Title",
  "description": "Updated description",
  "fundingGoal": 1500000
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "title": "Updated Pitch Title",
  "description": "Updated description",
  "company_name": "TechCorp",
  "industry": "saas",
  "target_audience": "B2B enterprises",
  "funding_goal": 1500000,
  "user_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### DELETE /pitch-deck/:id

Delete a specific pitch deck.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `id` (required): Pitch deck ID

**Response (200):**
```json
{
  "message": "Pitch deck deleted successfully"
}
```

### POST /pitch-deck/generate-content

Generate AI content for a specific slide.

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "slideType": "problem",
  "context": "B2B SaaS platform for project management",
  "companyInfo": {
    "name": "TechCorp",
    "industry": "saas",
    "description": "Revolutionary project management platform"
  },
  "additionalPrompt": "Focus on remote work challenges"
}
```

**Response (200):**
```json
{
  "content": "• Remote teams struggle with communication gaps\n• Project visibility is limited across departments\n• Manual processes slow down delivery...",
  "slideType": "problem",
  "companyInfo": {
    "name": "TechCorp",
    "industry": "saas",
    "description": "Revolutionary project management platform"
  }
}
```

### POST /pitch-deck/generate-outline

Generate a complete pitch deck outline.

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "TechCorp",
  "industry": "saas",
  "description": "Revolutionary project management platform",
  "targetAudience": "B2B enterprises",
  "fundingGoal": 1000000
}
```

**Response (200):**
```json
{
  "outline": "1. Title Slide\n   - Company name and tagline\n   - Presenter information\n\n2. Problem\n   - Market pain points\n   - Current solutions limitations...",
  "companyInfo": {
    "name": "TechCorp",
    "industry": "saas",
    "description": "Revolutionary project management platform"
  }
}
```

## 📤 Export Endpoints

### POST /export/pptx

Generate and download a PowerPoint presentation.

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "deckTitle": "My Startup Pitch",
  "deckDescription": "Revolutionary SaaS platform",
  "slides": [
    {
      "id": "uuid",
      "type": "title",
      "title": "Problem Statement",
      "content": "• Remote teams struggle with communication\n• Limited project visibility",
      "suggestedImages": ["team collaboration", "project dashboard"],
      "speakerNotes": "Focus on the pain points that resonate with the audience"
    }
  ]
}
```

**Response (200):**
- **Content-Type**: `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- **Content-Disposition**: `attachment; filename="My_Startup_Pitch_pitch_deck.pptx"`
- **Body**: Binary PPTX file data

## ❌ Error Handling

### Error Response Format

All API errors follow this format:

```json
{
  "error": "Error description",
  "message": "Detailed error message",
  "statusCode": 400
}
```

### Common Error Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 400 | Bad Request | Invalid request body, missing required fields |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | User doesn't have permission for this resource |
| 404 | Not Found | Resource doesn't exist or user doesn't have access |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error, OpenAI API issues |

### Error Examples

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid authentication token",
  "statusCode": 401
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Pitch deck with ID 'invalid-uuid' not found",
  "statusCode": 404
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "OpenAI API key not configured",
  "statusCode": 500
}
```

## 🚦 Rate Limiting

### Current Limits

- **Authentication endpoints**: 10 requests per minute per IP
- **Pitch deck CRUD**: 60 requests per minute per user
- **AI generation**: 10 requests per minute per user
- **Export endpoints**: 5 requests per minute per user

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 60 seconds.",
  "statusCode": 429
}
```

## 🔍 Request/Response Examples

### Complete Flow Example

1. **Sign Up:**
```bash
curl -X POST https://pitch-deck-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass123"}'
```

2. **Create Pitch Deck:**
```bash
curl -X POST https://pitch-deck-backend.onrender.com/api/pitch-deck \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Startup",
    "description": "AI-powered solution",
    "companyName": "StartupCorp",
    "industry": "ai",
    "targetAudience": "enterprises",
    "userId": "user-uuid"
  }'
```

3. **Generate Content:**
```bash
curl -X POST https://pitch-deck-backend.onrender.com/api/pitch-deck/generate-content \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slideType": "problem",
    "context": "AI automation for businesses",
    "companyInfo": {
      "name": "StartupCorp",
      "industry": "ai",
      "description": "AI-powered business automation"
    }
  }'
```

## 📝 Notes

### Data Types

- **UUID**: Standard UUID v4 format
- **Timestamps**: ISO 8601 format (UTC)
- **Currency**: Numbers in cents/smallest unit
- **Content**: Markdown-formatted strings

### Security Considerations

- All endpoints require HTTPS in production
- JWT tokens expire after 1 hour
- Refresh tokens are handled by Supabase client
- Row Level Security (RLS) enforced at database level

### Performance Tips

- Use pagination for large datasets
- Cache frequently accessed data
- Batch multiple operations when possible
- Monitor OpenAI API usage for cost optimization

---

**Need help?** Check our [Troubleshooting Guide](./TROUBLESHOOTING.md) or open an issue on GitHub.