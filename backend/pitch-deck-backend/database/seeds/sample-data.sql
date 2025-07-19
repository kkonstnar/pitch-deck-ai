-- Sample Database for Pitch Deck AI
-- Contains realistic user-generated pitch decks across various industries

-- Note: This assumes auth.users already has some sample users
-- If not, you'll need to create users through the Supabase Auth interface first

-- ============================================================================
-- SAMPLE PITCH DECKS
-- ============================================================================

-- 1. SaaS - Project Management Platform
INSERT INTO pitch_decks (id, title, description, company_name, industry, target_audience, funding_goal, user_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 
 'TaskFlow AI: Intelligent Project Management', 
 'AI-powered project management platform that automatically optimizes team workflows and predicts project risks before they happen.',
 'TaskFlow AI', 
 'saas', 
 'Mid-market companies with 50-500 employees', 
 2500000.00,
 -- Replace with actual user UUID from auth.users
 '00000000-0000-0000-0000-000000000001',
 '2024-01-15 10:30:00+00'
);

-- 2. E-commerce - Sustainable Fashion
INSERT INTO pitch_decks (id, title, description, company_name, industry, target_audience, funding_goal, user_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440002',
 'EcoThreads: Sustainable Fashion Marketplace',
 'Direct-to-consumer marketplace connecting eco-conscious consumers with verified sustainable fashion brands worldwide.',
 'EcoThreads',
 'ecommerce',
 'Environmentally conscious millennials and Gen-Z consumers',
 1800000.00,
 '00000000-0000-0000-0000-000000000002',
 '2024-01-20 14:45:00+00'
);

-- 3. FinTech - Small Business Banking
INSERT INTO pitch_decks (id, title, description, company_name, industry, target_audience, funding_goal, user_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440003',
 'NeoBiz: Banking for the Next Generation of Entrepreneurs',
 'Digital-first banking platform designed specifically for small businesses and startups, with integrated accounting and growth tools.',
 'NeoBiz Financial',
 'fintech',
 'Small business owners and startup founders',
 5000000.00,
 '00000000-0000-0000-0000-000000000003',
 '2024-02-01 09:15:00+00'
);

-- 4. HealthTech - Mental Wellness
INSERT INTO pitch_decks (id, title, description, company_name, industry, target_audience, funding_goal, user_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440004',
 'MindBridge: AI-Powered Mental Health Support',
 'Personalized mental health platform using AI to provide 24/7 support, mood tracking, and evidence-based interventions.',
 'MindBridge Health',
 'healthcare',
 'Healthcare providers and insurance companies',
 3200000.00,
 '00000000-0000-0000-0000-000000000004',
 '2024-02-10 16:20:00+00'
);

-- 5. EdTech - Professional Development
INSERT INTO pitch_decks (id, title, description, company_name, industry, target_audience, funding_goal, user_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440005',
 'SkillForge: Personalized Professional Development',
 'AI-driven learning platform that creates personalized career development paths based on individual goals and market demands.',
 'SkillForge',
 'education',
 'Corporate learning & development teams',
 1500000.00,
 '00000000-0000-0000-0000-000000000005',
 '2024-02-15 11:30:00+00'
);

-- ============================================================================
-- SAMPLE SLIDES FOR TASKFLOW AI (SaaS)
-- ============================================================================

-- Title Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440001',
 'TaskFlow AI: Intelligent Project Management',
 '{"main_title": "TaskFlow AI", "subtitle": "Intelligent Project Management", "tagline": "AI-powered workflows that adapt to your team", "presenter": "Sarah Chen, CEO & Co-founder", "date": "March 2024"}',
 'title',
 1,
 '2024-01-15 10:30:00+00'
);

-- Problem Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440001',
 'The Project Management Crisis',
 '• 70% of projects fail due to poor communication and planning
• Teams waste 2.5 hours daily on status updates and coordination
• Project managers spend 90% of time on administrative tasks, not strategy
• Average project overruns budget by 27% and timeline by 45%
• Remote work has amplified coordination challenges by 3x',
 'problem',
 2,
 '2024-01-15 10:30:00+00'
);

-- Solution Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440003',
 '550e8400-e29b-41d4-a716-446655440001',
 'TaskFlow AI: The Intelligent Solution',
 '• AI-powered workflow optimization that learns from your team patterns
• Predictive risk analysis identifies bottlenecks before they happen
• Automated task prioritization based on business impact and deadlines
• Smart resource allocation across projects and team members
• Seamless integration with existing tools (Slack, GitHub, Google Workspace)',
 'solution',
 3,
 '2024-01-15 10:30:00+00'
);

-- Market Size Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440004',
 '550e8400-e29b-41d4-a716-446655440001',
 'Massive and Growing Market Opportunity',
 '• Total Addressable Market (TAM): $45.8B project management software market
• Serviceable Addressable Market (SAM): $12.2B mid-market segment
• Serviceable Obtainable Market (SOM): $1.8B AI-powered PM tools
• Market growing at 12.4% CAGR driven by remote work and digital transformation
• 847,000+ mid-market companies globally seeking better project management',
 'market',
 4,
 '2024-01-15 10:30:00+00'
);

-- Traction Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440005',
 '550e8400-e29b-41d4-a716-446655440001',
 'Strong Early Traction and Validation',
 '• 15,000+ users across 450+ companies in 8 months
• $180K Monthly Recurring Revenue (MRR) with 98% retention rate
• 35% month-over-month growth for 6 consecutive months
• Net Promoter Score (NPS) of 72 (industry average: 31)
• Partnerships with 3 major consulting firms for enterprise rollout',
 'traction',
 5,
 '2024-01-15 10:30:00+00'
);

-- Business Model Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440006',
 '550e8400-e29b-41d4-a716-446655440001',
 'Scalable SaaS Business Model',
 '• Freemium: Free for teams up to 5 users (viral growth driver)
• Professional: $29/user/month for advanced AI features
• Enterprise: $79/user/month with custom integrations and support
• Add-ons: Advanced analytics ($10/user), API access ($500/month)
• Target: $50 Average Revenue Per User (ARPU) by year 2',
 'business_model',
 6,
 '2024-01-15 10:30:00+00'
);

-- ============================================================================
-- SAMPLE SLIDES FOR ECOTHREADS (E-COMMERCE)
-- ============================================================================

-- Title Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440007',
 '550e8400-e29b-41d4-a716-446655440002',
 'EcoThreads: Sustainable Fashion Marketplace',
 '{"main_title": "EcoThreads", "subtitle": "Where Style Meets Sustainability", "tagline": "Connecting conscious consumers with verified sustainable brands", "presenter": "Maya Patel, Founder & CEO", "date": "March 2024"}',
 'title',
 1,
 '2024-01-20 14:45:00+00'
);

-- Problem Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440008',
 '550e8400-e29b-41d4-a716-446655440002',
 'Fashion Industry Environmental Crisis',
 '• Fashion is the 2nd most polluting industry globally
• 92 million tons of textile waste generated annually
• 73% of consumers willing to pay more for sustainable fashion but struggle to find verified options
• Fast fashion brands greenwash their impact, misleading consumers
• Sustainable brands lack visibility and struggle with customer acquisition',
 'problem',
 2,
 '2024-01-20 14:45:00+00'
);

-- Solution Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440009',
 '550e8400-e29b-41d4-a716-446655440002',
 'Verified Sustainable Fashion Marketplace',
 '• Rigorous 47-point sustainability verification process for all brands
• Transparent supply chain tracking from raw materials to consumer
• Personalized style recommendations based on values and preferences
• Carbon-neutral shipping and plastic-free packaging
• Community features: reviews, style inspiration, impact tracking',
 'solution',
 3,
 '2024-01-20 14:45:00+00'
);

-- Market Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440010',
 '550e8400-e29b-41d4-a716-446655440002',
 'Rapidly Growing Sustainable Fashion Market',
 '• Global sustainable fashion market: $15.2B, growing at 20% CAGR
• 67% of Gen-Z prioritize sustainability in purchasing decisions
• Sustainable fashion searches increased 75% year-over-year
• Target market: 145M environmentally conscious consumers in US/EU
• Average sustainable fashion customer spends $890 annually vs $567 for fast fashion',
 'market',
 4,
 '2024-01-20 14:45:00+00'
);

-- ============================================================================
-- SAMPLE SLIDES FOR NEOBIZ FINANCIAL (FINTECH)
-- ============================================================================

-- Title Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440011',
 '550e8400-e29b-41d4-a716-446655440003',
 'NeoBiz: Banking for the Next Generation',
 '{"main_title": "NeoBiz Financial", "subtitle": "Banking Built for Entrepreneurs", "tagline": "Empowering small business growth through intelligent financial tools", "presenter": "Marcus Rodriguez, CEO", "date": "March 2024"}',
 'title',
 1,
 '2024-02-01 09:15:00+00'
);

-- Problem Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440012',
 '550e8400-e29b-41d4-a716-446655440003',
 'Small Business Banking Pain Points',
 '• Traditional banks reject 80% of small business loan applications
• Average 47 days to open a business bank account
• Monthly fees average $45-75 for basic business banking
• No integrated tools for cash flow management and growth planning
• Entrepreneurs spend 18 hours/month on financial administration',
 'problem',
 2,
 '2024-02-01 09:15:00+00'
);

-- Solution Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440013',
 '550e8400-e29b-41d4-a716-446655440003',
 'All-in-One Digital Banking Platform',
 '• 5-minute digital account opening with instant approval
• Integrated accounting, invoicing, and expense management
• AI-powered cash flow forecasting and financial insights
• Instant access to credit lines up to $250K based on real-time data
• No monthly fees, transparent pricing, and dedicated support',
 'solution',
 3,
 '2024-02-01 09:15:00+00'
);

-- Market Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440014',
 '550e8400-e29b-41d4-a716-446655440003',
 'Massive Small Business Banking Market',
 '• US small business banking market: $67B annually
• 33.2 million small businesses in the US growing at 3.5% annually
• 87% of small businesses dissatisfied with traditional banking
• Digital business banking growing at 15% CAGR
• Average small business spends $2,400/year on banking fees',
 'market',
 4,
 '2024-02-01 09:15:00+00'
);

-- Traction Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440015',
 '550e8400-e29b-41d4-a716-446655440003',
 'Strong Early Traction in Competitive Market',
 '• 12,000+ business accounts opened in 18 months
• $45M in deposits with 95% month-over-month retention
• $2.2M in credit facilitated with 2.1% default rate
• Average customer saves $1,200 annually vs traditional banks
• Featured in TechCrunch, Forbes, and Wall Street Journal',
 'traction',
 5,
 '2024-02-01 09:15:00+00'
);

-- Business Model Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440016',
 '550e8400-e29b-41d4-a716-446655440003',
 'Multiple Revenue Streams',
 '• Interchange fees: $35/customer/month average
• Credit line fees: 8-18% APR on outstanding balances
• Premium features: $25/month for advanced analytics
• Payment processing: 2.9% + $0.30 per transaction
• Target: $85 monthly revenue per customer by year 2',
 'business_model',
 6,
 '2024-02-01 09:15:00+00'
);

-- ============================================================================
-- SAMPLE SLIDES FOR MINDBRIDGE HEALTH (HEALTHTECH)
-- ============================================================================

-- Title Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440017',
 '550e8400-e29b-41d4-a716-446655440004',
 'MindBridge: AI-Powered Mental Health Support',
 '{"main_title": "MindBridge Health", "subtitle": "Personalized Mental Wellness at Scale", "tagline": "Bridging the gap between mental health need and care", "presenter": "Dr. Lisa Kim, CEO & Co-founder", "date": "March 2024"}',
 'title',
 1,
 '2024-02-10 16:20:00+00'
);

-- Problem Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440018',
 '550e8400-e29b-41d4-a716-446655440004',
 'Mental Health Crisis in Healthcare',
 '• 1 in 4 adults experience mental health issues annually
• Average wait time for mental health care: 6-8 weeks
• 76% of US counties lack adequate mental health providers
• Healthcare systems lose $300B annually due to untreated mental health
• 40% of patients discontinue treatment due to access barriers',
 'problem',
 2,
 '2024-02-10 16:20:00+00'
);

-- Solution Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440019',
 '550e8400-e29b-41d4-a716-446655440004',
 'AI-Powered Mental Health Platform',
 '• 24/7 AI-driven mental health support and crisis intervention
• Personalized therapy modules based on evidence-based practices
• Real-time mood tracking with predictive analytics
• Seamless integration with electronic health records (EHR)
• Provider dashboard for monitoring and intervention planning',
 'solution',
 3,
 '2024-02-10 16:20:00+00'
);

-- Market Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440020',
 '550e8400-e29b-41d4-a716-446655440004',
 'Growing Digital Mental Health Market',
 '• Global digital mental health market: $5.6B, growing at 23.6% CAGR
• US healthcare providers seeking digital solutions: 89%
• Mental health app downloads increased 200% during pandemic
• Insurance reimbursement for digital therapeutics expanding
• Target market: 6,000+ hospitals and 250,000+ healthcare providers in US',
 'market',
 4,
 '2024-02-10 16:20:00+00'
);

-- ============================================================================
-- SAMPLE SLIDES FOR SKILLFORGE (EDTECH)
-- ============================================================================

-- Title Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440021',
 '550e8400-e29b-41d4-a716-446655440005',
 'SkillForge: Personalized Professional Development',
 '{"main_title": "SkillForge", "subtitle": "AI-Driven Career Development", "tagline": "Forging the future workforce through personalized learning", "presenter": "Alex Thompson, Founder & CEO", "date": "March 2024"}',
 'title',
 1,
 '2024-02-15 11:30:00+00'
);

-- Problem Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440022',
 '550e8400-e29b-41d4-a716-446655440005',
 'Skills Gap Crisis in Corporate Learning',
 '• 87% of companies report significant skills gaps in their workforce
• $366B lost annually due to inadequate employee training
• Average employee receives only 24 hours of training per year
• 42% of employees consider leaving due to lack of development opportunities
• Traditional training programs have 15% completion rates',
 'problem',
 2,
 '2024-02-15 11:30:00+00'
);

-- Solution Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440023',
 '550e8400-e29b-41d4-a716-446655440005',
 'AI-Powered Personalized Learning Platform',
 '• AI-driven skills assessment and personalized learning paths
• Microlearning modules integrated into daily workflows
• Real-time progress tracking and adaptive content delivery
• Industry-specific certifications and competency mapping
• Manager insights and team development analytics',
 'solution',
 3,
 '2024-02-15 11:30:00+00'
);

-- Market Slide
INSERT INTO slides (id, pitch_deck_id, title, content, slide_type, position, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440024',
 '550e8400-e29b-41d4-a716-446655440005',
 'Expanding Corporate Learning Market',
 '• Global corporate e-learning market: $50B, growing at 13% CAGR
• 94% of employees would stay longer with development investment
• AI in education market projected to reach $25.7B by 2030
• Target customers: 200,000+ mid-to-large enterprises globally
• Average enterprise spends $1,400 per employee annually on training',
 'market',
 4,
 '2024-02-15 11:30:00+00'
);

-- ============================================================================
-- SAMPLE SLIDE VERSIONS (FOR VERSION CONTROL DEMO)
-- ============================================================================

-- Version 1 of TaskFlow AI Problem Slide
INSERT INTO slide_versions (id, slide_id, content, version_number, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440001',
 '660e8400-e29b-41d4-a716-446655440002',
 '• Most projects fail due to poor planning
• Teams waste time on status updates
• Project managers are overwhelmed with admin work',
 1,
 '2024-01-15 10:30:00+00'
);

-- Version 2 of TaskFlow AI Problem Slide (current version)
INSERT INTO slide_versions (id, slide_id, content, version_number, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440002',
 '660e8400-e29b-41d4-a716-446655440002',
 '• 70% of projects fail due to poor communication and planning
• Teams waste 2.5 hours daily on status updates and coordination
• Project managers spend 90% of time on administrative tasks, not strategy
• Average project overruns budget by 27% and timeline by 45%
• Remote work has amplified coordination challenges by 3x',
 2,
 '2024-01-15 11:45:00+00'
);

-- ============================================================================
-- SAMPLE DATA NOTES
-- ============================================================================

-- To use this sample data:
-- 1. First create sample users in Supabase Auth dashboard or via API
-- 2. Update the user_id values in pitch_decks table with actual UUIDs
-- 3. Run this script in Supabase SQL Editor
-- 4. Verify Row Level Security policies allow the data to be accessed

-- Sample user IDs used (replace with actual):
-- '00000000-0000-0000-0000-000000000001' - Sarah Chen (TaskFlow AI)
-- '00000000-0000-0000-0000-000000000002' - Maya Patel (EcoThreads)
-- '00000000-0000-0000-0000-000000000003' - Marcus Rodriguez (NeoBiz)
-- '00000000-0000-0000-0000-000000000004' - Dr. Lisa Kim (MindBridge)
-- '00000000-0000-0000-0000-000000000005' - Alex Thompson (SkillForge)