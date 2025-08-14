# E-Commerce Microservices Platform

A modern, full-stack e-commerce platform built with seperate microservices for AI based Image searching for category and AI based Product comparison, featuring a React frontend and multiple Spring Boot backend services with AI-powered features.

## 🏗️ Architecture Overview

This project consists of four main components:

- **Frontend**: React + Vite application with modern UI/UX
- **Core E-commerce Service**: Spring Boot backend handling products, orders, users, and payments
- **Image Search Service**: AI-powered image analysis using Gemini 1.5 Flash
- **Product Comparison Service**: Intelligent product comparison capabilities using Gemini 1.5 Flash

## 🚀 Services

### 1. E-Commerce Frontend (`ecom-frontend`)
- **Technology**: React 18 + Vite + TypeScript
- **UI Framework**: Material-UI + Tailwind CSS
- **State Management**: Redux Toolkit
- **Payment Integration**: Stripe
- **Features**:
  - Modern responsive design
  - Shopping cart functionality
  - User authentication
  - Payment processing
  - Product browsing and search

### 2. Core E-Commerce Service (`sb-ecom`)
- **Technology**: Spring Boot 3.5.0 + Java 21
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **Payment**: Stripe integration
- **Features**:
  - User authentication and authorization
  - Product catalog management
  - Shopping cart and order processing
  - Address management
  - Category management
  - Secure payment processing

### 3. Image Search Service (`image-search-service`)
- **Technology**: Spring Boot 3.2.0 + Java 17
- **AI Integration**: Gemini 1.5 Flash
- **Port**: 8085
- **Features**:
  - AI-powered image analysis
  - Visual product search
  - Image-based product recommendations
  - Multipart file upload support

### 4. Product Comparison Service (`product-comparison-service`)
- **Technology**: Spring Boot 3.5.4 + Java 21
- **HTTP Client**: OkHttp + WebFlux
- **Features**:
  - Intelligent product comparison
  - Feature analysis
  - Price comparison
  - Retry mechanisms for external API calls

## 🛠️ Technology Stack

### Frontend
- React 18 with Vite
- TypeScript
- Material-UI & Tailwind CSS
- Redux Toolkit for state management
- React Router for navigation
- Stripe for payments
- Axios for API calls

### Backend
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL database
- Maven for dependency management
- Lombok for code reduction
- ModelMapper for object mapping

### AI & External Services
- Google Gemini 1.5 Flash for image analysis
- Stripe for payment processing
- OkHttp for external API calls

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+ (Java 21 recommended)
- Maven 3.8+
- PostgreSQL database
- Docker (optional)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Database Setup**
   - Install and start PostgreSQL
   - Create databases for the services
   - Update connection strings in application properties

3. **Environment Variables**
   Set up the following environment variables:
   ```bash
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ecommerce
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   
   # JWT
   JWT_SECRET=your_jwt_secret
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   
   # Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Services

#### 1. Start the Core E-Commerce Service
```bash
cd sb-ecom
mvn spring-boot:run
```
Default port: 8080

#### 2. Start the Image Search Service
```bash
cd image-search-service
mvn spring-boot:run
```
Default port: 8085

#### 3. Start the Product Comparison Service
```bash
cd product-comparison-service
mvn spring-boot:run
```
Default port: 8086

#### 4. Start the Frontend
```bash
cd ecom-frontend
npm install
npm run dev
```
Default port: 5173

### Using Docker

Build and run the Image Search Service with Docker:
```bash
cd image-search-service
docker build -t image-search-service .
docker run -p 8085:8085 image-search-service
```

## 📚 API Documentation

### Core E-Commerce Service (`/api`)
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `GET /api/categories` - Get all categories
- `POST /api/cart` - Add to cart
- `GET /api/orders` - Get user orders
- `POST /api/addresses` - Add user address

### Image Search Service (`/api/v1`)
- `POST /api/v1/analyze` - Analyze uploaded images
- `POST /api/v1/search` - Search products by image

### Product Comparison Service (`/api/compare`)
- `POST /api/compare/products` - Compare multiple products
- `GET /api/compare/features` - Get comparison features

## 🔧 Development

### Code Style
- Java: Follow Spring Boot conventions
- React: ESLint configuration provided
- Use Lombok annotations to reduce boilerplate
- Follow REST API best practices

### Testing
```bash
# Backend services
mvn test

# Frontend
npm run test
```

### Building for Production
```bash
# Backend services
mvn clean package

# Frontend
npm run build
```
