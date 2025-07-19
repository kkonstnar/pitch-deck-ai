# 🤝 Contributing to Pitch Deck AI

We welcome contributions to Pitch Deck AI! This document provides guidelines for contributing to the project.

## 🌟 Ways to Contribute

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new functionality
- **Code Contributions**: Submit bug fixes or new features
- **Documentation**: Improve guides and documentation
- **Testing**: Help test new features and report issues
- **Community Support**: Help other users in discussions

## 🚀 Getting Started

### 1. Fork the Repository

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/pitch-deck-ai.git
cd pitch-deck-ai
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install
cd backend/pitch-deck-backend && npm install && cd ../..

# Set up environment variables
cp .env.example .env.local
cp backend/pitch-deck-backend/.env.example backend/pitch-deck-backend/.env

# Start development servers
npm run dev
# In another terminal:
cd backend/pitch-deck-backend && npm run start:dev
```

### 3. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 📝 Contribution Guidelines

### Code Style

- **TypeScript**: Use strict type checking
- **ESLint**: Follow the existing linting rules
- **Prettier**: Use for code formatting
- **Naming**: Use descriptive variable and function names
- **Comments**: Add JSDoc comments for functions and classes

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(ai): add support for custom prompts in slide generation
fix(export): resolve PPTX export timeout issue
docs(api): update API documentation for new endpoints
```

### Pull Request Process

1. **Update Documentation**: Ensure relevant docs are updated
2. **Add Tests**: Include tests for new features
3. **Check Build**: Ensure `npm run build` passes
4. **Update CHANGELOG**: Add entry for your changes
5. **Create PR**: Use the PR template

### Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend/pitch-deck-backend
npm test

# Run E2E tests (if available)
npm run test:e2e
```

## 🐛 Bug Reports

### Before Submitting

1. **Search existing issues** to avoid duplicates
2. **Try latest version** to see if issue is resolved
3. **Check troubleshooting guide** for common solutions

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Before Submitting

1. **Check existing feature requests** to avoid duplicates
2. **Consider the scope** - does it fit the project goals?
3. **Think about implementation** - how would it work?

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 🔧 Development Guidelines

### Frontend (Next.js)

- **Components**: Create reusable components in `/components`
- **Pages**: Use App Router structure in `/app`
- **Styling**: Use Tailwind CSS with shadcn/ui components
- **State Management**: Use React hooks and Context API
- **API Calls**: Create utility functions in `/utils`

### Backend (NestJS)

- **Modules**: Organize features into modules
- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **DTOs**: Define data transfer objects for type safety
- **Guards**: Implement authentication and authorization

### Database

- **Migrations**: Create SQL migration files for schema changes
- **RLS Policies**: Ensure proper row-level security
- **Indexes**: Add indexes for performance optimization
- **Types**: Update TypeScript types for new fields

## 📋 Project Structure

```
pitch-deck-ai/
├── app/                    # Next.js app pages
├── components/             # React components
├── utils/                  # Utility functions
├── docs/                   # Documentation
├── backend/
│   └── pitch-deck-backend/ # NestJS backend
│       ├── src/
│       │   ├── auth/       # Authentication module
│       │   ├── pitch-deck/ # Pitch deck module
│       │   ├── export/     # Export module
│       │   └── supabase/   # Supabase integration
│       └── database/       # Database migrations
└── README.md
```

## 🎯 Development Priorities

### High Priority
- **Performance improvements**
- **Security enhancements**
- **Bug fixes**
- **Mobile responsiveness**

### Medium Priority
- **New AI features**
- **Export improvements**
- **UI/UX enhancements**
- **Integration APIs**

### Low Priority
- **Advanced analytics**
- **Team collaboration features**
- **Mobile apps**
- **Third-party integrations**

## 🧪 Testing

### Unit Tests
```bash
# Frontend
npm test

# Backend
cd backend/pitch-deck-backend
npm test
```

### Integration Tests
```bash
# API endpoints
npm run test:integration

# Database operations
npm run test:db
```

### E2E Tests
```bash
# Full user workflows
npm run test:e2e
```

## 📚 Resources

### Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Project Resources
- [Design System](./docs/DESIGN_SYSTEM.md)
- [API Documentation](./docs/API.md)
- [Setup Guide](./docs/SETUP.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🏆 Recognition

Contributors will be recognized in:
- **README.md contributors section**
- **CHANGELOG.md** for each release
- **GitHub contributors page**
- **Project website** (when available)

## 📄 License

By contributing to Pitch Deck AI, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

- **GitHub Discussions**: For general questions
- **Discord**: Real-time community chat
- **Email**: maintainers@pitchdeckai.com

Thank you for contributing to Pitch Deck AI! 🚀