# 📊 Sample Database Guide

This guide covers the sample database containing user-generated pitch decks for Pitch Deck AI. The sample data provides realistic examples across multiple industries to help with development, testing, and demonstration.

## 🎯 Overview

The sample database includes:
- **5 complete pitch decks** across different industries
- **25+ slides** with realistic content and data
- **Version control examples** showing slide evolution
- **Industry-specific metrics** and business models
- **Realistic user profiles** and company information

## 🏢 Sample Companies

### 1. TaskFlow AI (SaaS)
- **Industry**: Project Management Software
- **Stage**: Series A
- **Funding Goal**: $2.5M
- **Key Metrics**: 15K users, $180K MRR, 98% retention
- **Unique Value**: AI-powered workflow optimization

### 2. EcoThreads (E-commerce)
- **Industry**: Sustainable Fashion
- **Stage**: Seed
- **Funding Goal**: $1.8M
- **Key Metrics**: Sustainable marketplace with verified brands
- **Unique Value**: 47-point sustainability verification

### 3. NeoBiz Financial (FinTech)
- **Industry**: Small Business Banking
- **Stage**: Series A
- **Funding Goal**: $5M
- **Key Metrics**: 12K accounts, $45M deposits, 95% retention
- **Unique Value**: 5-minute account opening with integrated tools

### 4. MindBridge Health (HealthTech)
- **Industry**: Mental Health Technology
- **Stage**: Seed
- **Funding Goal**: $3.2M
- **Key Metrics**: AI-powered mental health platform
- **Unique Value**: 24/7 support with predictive analytics

### 5. SkillForge (EdTech)
- **Industry**: Corporate Learning
- **Stage**: Seed
- **Funding Goal**: $1.5M
- **Key Metrics**: AI-driven personalized learning paths
- **Unique Value**: Microlearning integrated into workflows

## 📋 Database Schema

### Tables Included

#### `pitch_decks`
Contains the main pitch deck information:
- Company details and descriptions
- Industry classification
- Funding goals and stages
- Target audience information
- User ownership

#### `slides`
Individual slides with content:
- Slide titles and content
- Slide types (title, problem, solution, market, etc.)
- Position ordering
- Rich content in JSON format for title slides

#### `slide_versions`
Version control for slide content:
- Historical slide versions
- Content evolution tracking
- Version numbering
- Timestamp tracking

## 🚀 Setting Up Sample Data

### Method 1: Automated Seeding (Recommended)

Use the provided seeding script:

```bash
# Navigate to the seeding directory
cd backend/pitch-deck-backend/database/seeds

# Install dependencies if needed
npm install @supabase/supabase-js dotenv

# Basic seeding (requires existing users)
node seed.js

# Reset existing data and reseed
node seed.js --reset

# Create sample users and seed data (requires service role key)
node seed.js --users --reset
```

### Method 2: Manual SQL Execution

1. **Open Supabase Dashboard**
   - Go to your project dashboard
   - Navigate to SQL Editor

2. **Execute Sample Data SQL**
   - Copy the contents of `sample-data.sql`
   - Paste into SQL Editor
   - Execute the script

3. **Verify Installation**
   ```sql
   -- Check pitch decks
   SELECT id, title, company_name FROM pitch_decks;
   
   -- Check slides
   SELECT COUNT(*) as slide_count FROM slides;
   
   -- Check version history
   SELECT COUNT(*) as version_count FROM slide_versions;
   ```

### Method 3: API-Based Seeding

For production environments:

```javascript
// Example using Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Insert pitch deck
const { data, error } = await supabase
  .from('pitch_decks')
  .insert({
    title: 'TaskFlow AI: Intelligent Project Management',
    company_name: 'TaskFlow AI',
    industry: 'saas',
    // ... other fields
  });
```

## 🔧 Configuration Requirements

### Environment Variables

Ensure these are set in your `.env` file:

```bash
# Required for basic operation
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

# Required for user creation (optional)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### User Setup

#### Option A: Automatic User Creation
If you have a service role key, the seeding script can create users:

```bash
node seed.js --users --reset
```

Sample user credentials:
- **sarah.chen@taskflow.ai** / demo123!
- **maya.patel@ecothreads.com** / demo123!
- **marcus.rodriguez@neobiz.com** / demo123!
- **lisa.kim@mindbridge.health** / demo123!
- **alex.thompson@skillforge.com** / demo123!

#### Option B: Manual User Creation
1. Use Supabase Auth dashboard
2. Create users with the emails above
3. Update `user_id` fields in the sample data
4. Re-run the seeding script

## 📊 Sample Data Structure

### Pitch Deck Content Types

#### Title Slides
```json
{
  "main_title": "Company Name",
  "subtitle": "Value Proposition",
  "tagline": "Brief compelling statement",
  "presenter": "Name, Title",
  "date": "Presentation Date"
}
```

#### Problem/Solution Slides
- Bullet-point format
- Specific statistics and metrics
- Market research data
- Customer pain points

#### Market Slides
- TAM/SAM/SOM breakdowns
- Growth rates and trends
- Competitive landscape
- Market validation data

#### Traction Slides
- User/customer metrics
- Revenue numbers
- Growth rates
- Social proof elements

### Industry-Specific Metrics

#### SaaS Companies
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rates and retention
- Net Promoter Score (NPS)

#### E-commerce Companies
- Transaction volumes
- Average order values
- Customer acquisition metrics
- Inventory turnover
- Market penetration

#### FinTech Companies
- Assets under management
- Transaction processing volumes
- Default rates and risk metrics
- Regulatory compliance status
- Partnership agreements

## 🎨 Customizing Sample Data

### Adding New Companies

1. **Create New Pitch Deck Record**
   ```sql
   INSERT INTO pitch_decks (id, title, description, company_name, industry, target_audience, funding_goal, user_id, created_at) 
   VALUES (
     'your-uuid-here',
     'Your Company Title',
     'Company description',
     'Company Name',
     'industry',
     'target audience',
     funding_amount,
     'user-uuid',
     NOW()
   );
   ```

2. **Add Corresponding Slides**
   - Follow the same pattern as existing slides
   - Use appropriate slide types
   - Maintain realistic content structure

3. **Update Seeding Script**
   - Add new data to `sample-data.sql`
   - Update cleanup queries in `seed.js`
   - Test the updated script

### Modifying Existing Data

1. **Update Content**
   - Modify slide content in `sample-data.sql`
   - Keep UUIDs consistent
   - Update any dependent references

2. **Add New Slide Types**
   - Competition analysis
   - Team introductions
   - Financial projections
   - Funding utilization

3. **Version Control Examples**
   - Add more `slide_versions` entries
   - Show content evolution over time
   - Demonstrate collaborative editing

## 🔍 Using Sample Data

### Development Testing

```javascript
// Fetch sample pitch decks
const { data: sampleDecks } = await supabase
  .from('pitch_decks')
  .select('*')
  .limit(5);

// Test slide operations
const { data: slides } = await supabase
  .from('slides')
  .select('*')
  .eq('pitch_deck_id', sampleDecks[0].id)
  .order('position');
```

### Demo Presentations

1. **Use sample accounts** to show realistic user experience
2. **Export sample decks** to demonstrate export functionality
3. **Show AI assistance** by modifying sample content
4. **Demonstrate collaboration** with version history

### User Onboarding

1. **Template library**: Users can copy sample structures
2. **Best practices**: Show well-formatted content examples
3. **Industry examples**: Users can see relevant sample decks
4. **Feature demonstration**: Show all capabilities with real data

## 🚨 Important Notes

### Data Privacy and Security

- **Development Only**: Sample data is for development/demo purposes
- **No Real Companies**: All companies and data are fictional
- **Clean on Production**: Remove sample data before production deployment
- **User Permissions**: Ensure proper RLS policies are in place

### Maintenance

- **Regular Updates**: Keep sample data current with market trends
- **Content Quality**: Maintain realistic and compelling content
- **Technical Updates**: Update structure when database schema changes
- **Performance**: Monitor query performance with sample data volume

### Limitations

- **Fixed User IDs**: Sample data uses placeholder user IDs
- **Static Content**: Content doesn't update dynamically
- **Limited Scope**: Only covers 5 industries currently
- **Version Control**: Limited version history examples

## 📞 Troubleshooting

### Common Issues

#### "User not found" errors
```bash
# Solution: Create users first or update user_id references
node seed.js --users
```

#### "Row Level Security policy violated"
```sql
-- Solution: Check RLS policies are properly configured
SELECT * FROM pg_policies WHERE tablename = 'pitch_decks';
```

#### "Duplicate key value violates unique constraint"
```bash
# Solution: Clean existing data first
node seed.js --reset
```

#### Seeding script fails
1. Check environment variables are set
2. Verify Supabase connection
3. Ensure database schema is up to date
4. Check for syntax errors in SQL

### Getting Help

1. **Check logs**: Review seeding script output for specific errors
2. **Verify connection**: Test Supabase connection independently
3. **Database state**: Check current database contents
4. **Permissions**: Verify API key permissions for required operations

## 🔮 Future Enhancements

### Planned Additions
- More industry verticals (AgTech, PropTech, Gaming)
- Advanced slide types (financial models, competitive analysis)
- Multi-language support for international examples
- Industry-specific KPIs and benchmarks
- Enhanced version control examples

### Integration Opportunities
- AI content generation based on sample patterns
- Template recommendation engine
- Benchmark comparison tools
- Content quality scoring

---

**Ready to use the sample database?** Start with the [setup instructions](#-setting-up-sample-data) or jump straight to seeding with `node seed.js --reset --users`!