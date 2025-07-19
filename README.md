# 🚀 Pitch Deck AI

An AI-powered pitch deck generator that helps entrepreneurs and businesses create compelling, professional presentations using artificial intelligence.

![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![NestJS](https://img.shields.io/badge/Backend-NestJS-red)
![Supabase](https://img.shields.io/badge/Database-Supabase-green)
![OpenAI](https://img.shields.io/badge/AI-OpenAI-blue)

## 🌟 Features

### ✨ AI-Powered Generation
- **Smart Content Creation**: Generate entire pitch decks from business descriptions
- **Industry-Specific Templates**: Tailored content for different industries (SaaS, E-commerce, Healthcare, etc.)
- **Intelligent Slide Enhancement**: AI-driven content improvement and suggestions
- **Real-time Chat Assistant**: Interactive AI help for slide optimization

### 🎨 Professional Design
- **Modern UI/UX**: Clean, responsive design with dark/light mode support
- **Drag & Drop**: Intuitive slide reordering and management
- **Live Preview**: Real-time slide preview and editing
- **Export Options**: PDF and PowerPoint (PPTX) export functionality

### 💾 Data Management
- **User Authentication**: Secure login with Supabase Auth
- **Cloud Storage**: Save and manage multiple pitch decks
- **Version Control**: Track slide changes and revisions
- **Sample Database**: Pre-populated with realistic pitch decks across 5 industries
- **Collaboration Ready**: Multi-user support with proper data isolation

### 🔧 Developer Features
- **Full-Stack TypeScript**: Type-safe development across frontend and backend
- **RESTful API**: Well-documented API endpoints
- **Scalable Architecture**: Microservices-ready backend with NestJS
- **Production Ready**: Deployed on Vercel and Render with proper CI/CD

## 🚀 Live Demo

**Frontend**: [https://pitch-deck-ai-nrz1.vercel.app](https://pitch-deck-ai-nrz1.vercel.app)
**Backend API**: [https://pitch-deck-backend.onrender.com/api](https://pitch-deck-backend.onrender.com/api)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (Supabase)    │
│   Vercel        │    │   Render        │    │   PostgreSQL    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
   • React 19            • Node.js 18+           • User Auth
   • TypeScript          • TypeScript            • Data Storage
   • Tailwind CSS        • OpenAI API            • Row Level Security
   • shadcn/ui           • PDF/PPTX Export       • Real-time APIs
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks + Context API
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

### Backend
- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **File Generation**: jsPDF, PptxGenJS
- **Deployment**: Render

### Database
- **Primary**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Features**: Row Level Security, Real-time subscriptions

## 📋 Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Supabase Account**: For database and authentication
- **OpenAI API Key**: For AI functionality
- **Vercel Account**: For frontend deployment (optional)
- **Render Account**: For backend deployment (optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/kkonstnar/pitch-deck-ai.git
cd pitch-deck-ai
```

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend/pitch-deck-backend
npm install
cd ../..
```

### 3. Environment Setup
```bash
# Frontend (.env.local)
cp .env.example .env.local

# Backend (.env)
cp backend/pitch-deck-backend/.env.example backend/pitch-deck-backend/.env
```

### 4. Configure Environment Variables
See [SETUP.md](./docs/SETUP.md) for detailed configuration instructions.

### 5. Populate Sample Database (Optional)
```bash
# Navigate to seeding directory
cd backend/pitch-deck-backend/database/seeds

# Seed with sample pitch decks across 5 industries
node seed.js --reset

# Or create sample users and seed data
node seed.js --users --reset
```

### 6. Start Development Servers
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend/pitch-deck-backend
npm run start:dev
```

Visit `http://localhost:3000` to see the application.

## 📖 Documentation

- **[Setup & Deployment Guide](./docs/SETUP.md)** - Complete installation and deployment instructions
- **[API Documentation](./docs/API.md)** - Backend API endpoints and usage
- **[User Guide](./docs/USER_GUIDE.md)** - How to use the application
- **[Sample Database Guide](./docs/SAMPLE_DATABASE.md)** - Pre-populated sample data across 5 industries
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues and solutions

## 🔑 Environment Variables

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Backend (Render)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
```

## 🚀 Deployment

This application is designed for easy deployment on modern platforms:

### Production Deployment (Recommended)
- **Frontend**: Vercel (automatic deployments from GitHub)
- **Backend**: Render (automatic deployments from GitHub)
- **Database**: Supabase (managed PostgreSQL)

### Alternative Deployment Options
- **Frontend**: Netlify, AWS Amplify, CloudFlare Pages
- **Backend**: Railway, Fly.io, DigitalOcean App Platform
- **Database**: Railway PostgreSQL, PlanetScale, Neon

See [SETUP.md](./docs/SETUP.md) for step-by-step deployment instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4 API
- **Supabase** for the excellent backend-as-a-service platform
- **Vercel** for seamless frontend deployment
- **Render** for reliable backend hosting
- **shadcn/ui** for beautiful UI components

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/kkonstnar/pitch-deck-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kkonstnar/pitch-deck-ai/discussions)
- **Email**: support@pitchdeckai.com

## 🗺️ Roadmap

- [ ] **Multi-language Support**: Internationalization for global users
- [ ] **Team Collaboration**: Real-time collaborative editing
- [ ] **Advanced Templates**: More industry-specific templates
- [ ] **Analytics Dashboard**: Presentation performance metrics
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Integration APIs**: Connect with CRM and presentation tools

---

**Built with ❤️ by the Pitch Deck AI Team**

*Empowering entrepreneurs to create compelling stories that drive business success.*