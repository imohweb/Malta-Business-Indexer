# Contributing to Malta Business Indexer

Thank you for your interest in contributing to the Malta Business Indexer! This document provides guidelines and information for contributors.

## 🎯 Project Overview

The Malta Business Indexer is an open-source project that helps users discover and locate grocery stores and businesses in Malta using OpenStreetMap data. The project consists of:

- **Backend**: FastAPI application with OpenStreetMap integration
- **Frontend**: React application with interactive mapping
- **CI/CD**: Manual GitHub Actions workflows for controlled deployment

## 📋 Before You Start

### Prerequisites

- **Python 3.8+** for backend development
- **Node.js 16+** for frontend development
- **Git** for version control
- **Azure account** (optional, for testing deployments)
- **Basic understanding** of FastAPI, React, and Docker

### Development Setup

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/your-username/Malta-Business-Indexer.git
   cd Malta-Business-Indexer
   ```

2. **Set up backend environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up frontend environment**:
   ```bash
   cd frontend
   npm install
   ```

4. **Create environment files** (see `.env.example` files in each directory)

## 🤝 How to Contribute

### Types of Contributions Welcome

- **🐛 Bug fixes**: Fix issues in functionality or performance
- **✨ New features**: Add new capabilities or improve existing ones
- **📚 Documentation**: Improve guides, comments, or examples
- **🧪 Tests**: Add or improve test coverage
- **🎨 UI/UX improvements**: Enhance user experience and design
- **🔧 DevOps**: Improve workflows, deployment, or infrastructure
- **🌍 Accessibility**: Make the app more accessible to all users

### Getting Started

1. **Check existing issues** or create a new one to discuss your idea
2. **Assign yourself** to the issue (or comment your interest)
3. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following the guidelines below
5. **Test your changes** thoroughly
6. **Submit a pull request** with clear description

## 📝 Development Guidelines

### Code Style

#### Backend (Python)
- Follow **PEP 8** style guidelines
- Use **type hints** for function parameters and returns
- Write **descriptive docstrings** for functions and classes
- Keep functions **small and focused**
- Use **meaningful variable names**

Example:
```python
def search_grocery_stores(
    location: str, 
    radius: int = 1000
) -> List[GroceryStore]:
    """
    Search for grocery stores near a given location.
    
    Args:
        location: Address or place name to search near
        radius: Search radius in meters (default: 1000)
        
    Returns:
        List of GroceryStore objects found in the area
    """
    # Implementation here
```

#### Frontend (JavaScript/React)
- Use **ES6+** features and modern React patterns
- Follow **consistent naming conventions** (camelCase for variables/functions)
- Write **descriptive component names**
- Use **functional components** with hooks
- Keep components **small and reusable**

Example:
```javascript
/**
 * Display a grocery store card with location and details
 * @param {Object} store - Store object with name, address, etc.
 * @param {Function} onSelect - Callback when store is selected
 */
const StoreCard = ({ store, onSelect }) => {
  // Component implementation
};
```

### Testing

#### Backend Testing
- Write **unit tests** for business logic
- Use **pytest** for testing framework
- Test **API endpoints** with test client
- Mock **external services** (OpenStreetMap API)
- Aim for **>80% test coverage**

Run tests:
```bash
cd backend
pytest
pytest --cov=app tests/  # With coverage
```

#### Frontend Testing
- Write **component tests** using React Testing Library
- Test **user interactions** and state changes
- Mock **API calls** in tests
- Test **accessibility** features

Run tests:
```bash
cd frontend
npm test
npm test -- --coverage  # With coverage
```

### Commit Guidelines

Use **conventional commits** format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

Examples:
```bash
feat(backend): add store rating filtering
fix(frontend): resolve map loading issue
docs(readme): update installation instructions
test(backend): add unit tests for store service
```

## 🔍 Pull Request Process

### Before Submitting

1. **Update your branch** with latest main:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run all tests** and ensure they pass:
   ```bash
   # Backend
   cd backend && pytest
   
   # Frontend
   cd frontend && npm test
   ```

3. **Check code quality**:
   ```bash
   # Backend linting
   cd backend && flake8 app/
   
   # Frontend linting
   cd frontend && npm run lint
   ```

4. **Update documentation** if needed

### Pull Request Template

When creating a PR, please include:

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

### Review Process

1. **Automated checks** must pass (linting, tests)
2. **At least one approval** from maintainer required
3. **All conversations resolved** before merge
4. **Manual deployment testing** may be requested for significant changes

## 🚀 Manual Deployment Testing

This project uses **manual-only deployments** for quality control. Here's how to test deployments:

### Testing Your Changes

1. **Fork the repository** to your GitHub account
2. **Set up Azure resources** (if testing backend changes)
3. **Configure GitHub secrets** for your resources
4. **Manually trigger workflows** to test deployment
5. **Verify functionality** in deployed environment

### Deployment Workflow

All deployments are manual to ensure quality:

1. **Go to Actions tab** in your fork
2. **Select appropriate workflow**:
   - Backend changes: "Deploy Backend to Azure Container Apps"
   - Frontend changes: "Deploy Frontend to GitHub Pages"
   - Full deployment: "Full Stack Deployment"
3. **Click "Run workflow"**
4. **Fill in your resource details**
5. **Monitor deployment** and test functionality

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (OS, browser, Python version)
5. **Screenshots or logs** if helpful

### Feature Requests

For new features, please include:

1. **Problem statement**: What need does this address?
2. **Proposed solution**: How should it work?
3. **Alternatives considered**: Other approaches you've thought of
4. **Additional context**: Any other relevant information

## 📚 Resources

### Project Documentation
- [README.md](./README.md) - Project overview and setup
- [WORKFLOW_CONFIGURATION.md](./docs/WORKFLOW_CONFIGURATION.md) - CI/CD configuration
- [Backend API Documentation](./backend/README.md) - Backend specifics
- [Frontend Documentation](./frontend/README.md) - Frontend specifics

### External Resources
- [OpenStreetMap Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Container Apps](https://docs.microsoft.com/en-us/azure/container-apps/)

## 🏷️ Project Labels

We use these labels to organize issues and PRs:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `backend` - Backend-related changes
- `frontend` - Frontend-related changes
- `deployment` - CI/CD and deployment changes

## 💬 Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Pull Request Comments**: For code-specific questions

### Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). Please be respectful and inclusive in all interactions.

### Recognition

Contributors are recognized in:
- **Contributors section** of README.md
- **Release notes** for significant contributions
- **GitHub contributors graph**

## 🎉 Thank You!

Your contributions help make Malta Business Indexer better for everyone. Whether you're fixing a typo, adding a feature, or improving documentation - every contribution matters!

---

**Happy Contributing! 🚀**

For questions about contributing, feel free to open an issue or reach out to the maintainers.