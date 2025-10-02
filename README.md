# Malta Grocery Stores Indexer

An **open source** application for indexing and discovering grocery stores across Malta using modern web technologies and Azure cloud services. This project welcomes contributions from developers worldwide! 🌍

## 🌟 Open Source Project

This is a community-driven open source project. We encourage:
- 🤝 **Contributions**: Bug fixes, features, documentation improvements
- 🔧 **Customization**: Fork and adapt for your own region or use case
- 📚 **Learning**: Use as a reference for modern full-stack development
- 🚀 **Deployment**: Multiple deployment options for different needs

## 🌐 Live Application

- **Frontend**: https://imohweb.github.io/Malta-Business-Indexer
- **Backend API**: https://iac-infraengine-backend.azurecontainerapps.io
- **API Documentation**: https://iac-infraengine-backend.azurecontainerapps.io/docs

## 🚀 Features

- **Interactive Map**: Explore Malta's grocery stores with OpenStreetMap integration
- **GPS Location**: Find stores near your current location
- **Advanced Search**: Filter by name, rating, price level, and distance
- **Real-time Data**: Integrated with Google Places API for up-to-date information
- **Mobile Responsive**: Optimized for all devices
- **Store Details**: Comprehensive information including ratings, addresses, and contact details
- **CI/CD Pipeline**: Automated deployment with GitHub Actions
- **Infrastructure as Code**: Complete Azure Bicep templates included

## 🏗️ Architecture

### Backend (Python)
- **Framework**: FastAPI for high-performance REST API
- **Database**: SQLite (development) / PostgreSQL (production)
- **External APIs**: Google Places API for store discovery
- **Deployment**: Azure Container Apps with Docker
- **Features**: Auto-refresh, search optimization, Malta geo-bounds filtering

### Frontend (React)
- **Framework**: React 18 with modern hooks
- **Styling**: Styled Components with responsive design
- **Maps**: OpenStreetMap with Leaflet for free, open-source mapping
- **Deployment**: GitHub Pages for static hosting
- **State Management**: Custom hooks with efficient caching

### Cloud Infrastructure
- **Azure Container Registry**: Docker image storage
- **Azure Container Apps**: Scalable, serverless backend hosting
- **GitHub Pages**: Static frontend hosting
- **GitHub Actions**: Automated CI/CD pipeline
- **Azure Log Analytics**: Monitoring and logging

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/imohweb/Malta-Business-Indexer.git
cd Malta-Business-Indexer

# 2. Setup backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
# Add GOOGLE_PLACES_API_KEY to .env file

# 3. Setup frontend
cd ../frontend
npm install

# 4. Run the application
# Terminal 1 - Backend
cd backend && python -m uvicorn app.main:app --reload

# Terminal 2 - Frontend  
cd frontend && npm start
```

Visit: `http://localhost:3000` 🎉

## 🚀 Deployment Options

This project supports two deployment approaches:

### Option A: Use Existing Infrastructure (Recommended for Testing)
Deploy directly to our existing Azure resources for quick testing and contributions.

### Option B: Create Your Own Infrastructure
Deploy your own complete instance using the included Infrastructure as Code templates.

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions on both approaches.

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **Google Places API Key** with the following APIs enabled:
  - Places API (for store discovery)
  - Geocoding API (optional, for address lookup)

> **Note**: This project uses OpenStreetMap for map visualization, which doesn't require an API key. Only Google Places API is needed for store data discovery.

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/imohweb/Malta-Business-Indexer.git
cd Malta-Business-Indexer
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env with your Google Places API key
# GOOGLE_PLACES_API_KEY=your_api_key_here
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file (optional for local development)
cp .env.example .env

# For local development, the app will use OpenStreetMap by default
# No additional API keys required for mapping
```

### 4. Get Google Places API Key (Backend Only)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Places API** (and optionally Geocoding API)
4. Create credentials (API Key)
5. Restrict the API key to your server IP (recommended for production)

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend

# Activate virtual environment if not already active
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Start the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### Start Frontend Application

```bash
cd frontend

# Start the development server
npm start
```

The application will be available at `http://localhost:3000`

## 📡 API Endpoints

### Stores

- `GET /api/stores` - Get all grocery stores
- `GET /api/stores/search` - Search stores with filters
- `GET /api/stores/nearby` - Get stores near location
- `GET /api/stores/{id}` - Get specific store
- `POST /api/stores/refresh` - Refresh store data from Google Places

### Utility

- `GET /` - API information
- `GET /health` - Health check
- `GET /api/stores/stats/overview` - Store statistics

## 🔧 Configuration

### Backend (.env)

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
DATABASE_URL=sqlite:///./grocery_stores.db
DEBUG=True
CORS_ORIGINS=http://localhost:3000,https://imohweb.github.io
```

### Frontend (.env)

For local development, create a `.env` file (optional):

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MALTA_CENTER_LAT=35.8989
REACT_APP_MALTA_CENTER_LNG=14.5146
REACT_APP_DEFAULT_ZOOM=12
```

> **Note**: The frontend automatically detects the environment and uses appropriate API URLs. For GitHub Pages deployment, it uses the production backend at `https://iac-infraengine-backend.azurecontainerapps.io`.

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🌐 Production Deployment

This project uses **GitHub Actions** for automated CI/CD deployment:

### Automated Deployment Workflow

1. **Code Push**: Push changes to the `main` branch
2. **Backend Deployment**: 
   - Builds Docker image
   - Pushes to Azure Container Registry
   - Updates Azure Container Apps
3. **Frontend Deployment**:
   - Builds React application
   - Deploys to GitHub Pages

### Manual Deployment Options

#### Backend (Azure Container Apps)

```bash
cd backend

# Build Docker image
docker build -t malta-grocery-api .

# Tag for Azure Container Registry
docker tag malta-grocery-api iacstudioregistry.azurecr.io/malta-grocery-api:latest

# Push to registry (requires authentication)
docker push iacstudioregistry.azurecr.io/malta-grocery-api:latest
```

#### Frontend (GitHub Pages)

```bash
cd frontend

# Build for production
npm run build

# Deploy to GitHub Pages (using gh-pages package)
npm run deploy
```

### Setting Up Your Own Deployment

For detailed instructions on setting up your own deployment infrastructure, see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

### Environment Variables for Production

**Backend**:
- `GOOGLE_PLACES_API_KEY`: Your Google Places API key
- `DATABASE_URL`: Production database connection string
- `DEBUG=False`: Disable debug mode
- `CORS_ORIGINS`: Your frontend domain

**GitHub Secrets Required**:
- `AZURE_CREDENTIALS`: Azure service principal credentials
- `REGISTRY_USERNAME`: Azure Container Registry username
- `REGISTRY_PASSWORD`: Azure Container Registry password

## 🔍 Usage Guide

### Finding Stores

1. **Browse Map**: Pan and zoom to explore stores
2. **Search**: Use the search bar to find specific stores
3. **Near Me**: Click "Near Me" to find stores around your location
4. **Filters**: Apply rating and price filters to narrow results

### Store Information

- Click any marker for basic details
- Click "View on Map" in store list for detailed view
- Click "Directions" to open Google Maps navigation

### Data Refresh

- Stores are automatically updated from Google Places API
- Manual refresh available via API endpoint
- Data includes ratings, hours, contact info, and location

## 🛡️ Security Considerations

- API key restrictions (domain/IP based)
- Input validation and sanitization
- CORS configuration for production
- Rate limiting for API endpoints (recommended)
- HTTPS in production

## 📊 Performance

- **Backend**: FastAPI provides high performance with async support
- **Frontend**: Code splitting and lazy loading for optimal bundle size
- **Database**: Indexed queries for fast location-based searches
- **Caching**: Local storage for user preferences and recent searches

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here are several ways to contribute:

### 🛠️ Development Contributions
- **Bug Fixes**: Help us identify and fix issues
- **Feature Development**: Add new functionality
- **Code Optimization**: Improve performance and code quality
- **Testing**: Write unit tests and integration tests

### 📚 Documentation
- **API Documentation**: Improve endpoint documentation
- **Setup Guides**: Enhance installation and deployment guides
- **Tutorials**: Create user guides and tutorials
- **Code Comments**: Add helpful code documentation

### 🌍 Localization & Adaptation
- **Regional Adaptation**: Adapt for other countries/regions
- **Language Support**: Add multi-language support
- **Local Data Sources**: Integrate regional business directories

### 🚀 Infrastructure & DevOps
- **CI/CD Improvements**: Enhance the deployment pipeline
- **Monitoring**: Add application monitoring and alerts
- **Performance**: Optimize database queries and API responses
- **Security**: Improve security measures and practices

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes with clear, descriptive commits
4. **Test** your changes locally
5. **Push** to your branch: `git push origin feature/amazing-feature`
6. **Create** a Pull Request with a clear description

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all GitHub Actions workflows pass
- Be respectful and collaborative in discussions

### Getting Help

- 📖 Check the [DEPLOYMENT.md](docs/DEPLOYMENT.md) for setup guidance
- 🐛 Open an issue for bugs or feature requests
- 💬 Join discussions in pull requests and issues
- 📧 Reach out to maintainers for guidance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the API documentation at `/docs`
2. Review console logs for error details
3. Ensure API keys are properly configured
4. Verify network connectivity for API calls

## 🙏 Acknowledgments

- **OpenStreetMap** for providing free, open-source mapping data and services
- **Google Places Platform** for comprehensive business location data
- **FastAPI** framework for the robust and performant backend
- **React** community for excellent tooling and ecosystem
- **Azure** for reliable cloud infrastructure services
- **GitHub** for hosting, actions, and collaborative development tools
- **Malta's local businesses** for being part of this directory
- **Open source community** for inspiration and continuous improvement

## 🌟 Star the Project

If you find this project useful, please consider giving it a star ⭐ on GitHub! It helps others discover the project and motivates continued development.

---

**Built with ❤️ by the open source community for Malta and beyond** 🇲🇹
