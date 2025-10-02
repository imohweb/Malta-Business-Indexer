# Malta Grocery Stores Indexer

A world-class application for indexing and discovering grocery stores across Malta using Google Maps and GPS integration.

## 🚀 Features

- **Interactive Map**: Explore Malta's grocery stores with Google Maps integration
- **GPS Location**: Find stores near your current location
- **Advanced Search**: Filter by name, rating, price level, and distance
- **Real-time Data**: Integrated with Google Places API for up-to-date information
- **Mobile Responsive**: Optimized for all devices
- **Store Details**: Comprehensive information including ratings, addresses, and contact details

## 🏗️ Architecture

### Backend (Python)

- **Framework**: FastAPI for high-performance REST API
- **Database**: SQLite (development) / PostgreSQL (production)
- **External APIs**: Google Places API for store discovery
- **Features**: Auto-refresh, search optimization, Malta geo-bounds filtering

### Frontend (React)

- **Framework**: React 18 with modern hooks
- **Styling**: Styled Components with responsive design
- **Maps**: Google Maps JavaScript API
- **State Management**: Custom hooks with efficient caching

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **Google Maps API Key** with the following APIs enabled:
  - Maps JavaScript API
  - Places API
  - Geocoding API

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MT-grocery-stores-indexer
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

# Edit .env with your Google Maps API key
# GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 4. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API (optional)
4. Create credentials (API Key)
5. Restrict the API key (recommended):
   - For backend: Restrict to server IP
   - For frontend: Restrict to your domain

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
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
DATABASE_URL=sqlite:///./grocery_stores.db
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:8080
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
REACT_APP_MALTA_CENTER_LAT=35.8989
REACT_APP_MALTA_CENTER_LNG=14.5146
REACT_APP_DEFAULT_ZOOM=12
```

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

## 🌐 Deployment

### Backend Deployment

1. **Environment Setup**:

   - Set `DEBUG=False`
   - Use PostgreSQL for production: `DATABASE_URL=postgresql://user:pass@localhost/dbname`
   - Set proper CORS origins

2. **Docker Deployment**:

   ```bash
   cd backend
   docker build -t malta-grocery-api .
   docker run -p 8000:8000 malta-grocery-api
   ```

3. **Cloud Platforms** (Heroku, DigitalOcean, AWS, etc.):
   - Install dependencies from `requirements.txt`
   - Set environment variables
   - Run with Gunicorn: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker`

### Frontend Deployment

1. **Build for Production**:

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Static Hosting**:
   - Upload `build/` folder to Netlify, Vercel, or GitHub Pages
   - Configure environment variables
   - Set up custom domain (optional)

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

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the API documentation at `/docs`
2. Review console logs for error details
3. Ensure API keys are properly configured
4. Verify network connectivity for API calls

## 🙏 Acknowledgments

- Google Maps Platform for location services
- FastAPI framework for the robust backend
- React community for excellent tooling
- Malta's local businesses for the data
