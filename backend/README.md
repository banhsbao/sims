# SIMS Backend

Smart Invoice Management System - Backend API

## Features

- JWT Authentication
- Invoice Management with AI OCR
- Customer, Product, and Project Management
- File Upload Support

## Quick Start

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys

# Start PostgreSQL via Docker
docker-compose up -d

# Run migrations (if needed)
npm run migration:run

# Start development server
npm run start:dev
```

## API Documentation

The backend includes comprehensive API documentation using Swagger/OpenAPI.

### Accessing Swagger UI

Once the development server is running, access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

### Using Protected Endpoints

Most endpoints require JWT authentication:

1. **Register a new user** or **Login** using the `/api/auth/register` or `/api/auth/login` endpoints
2. Copy the JWT token from the response
3. Click the **"Authorize"** button (🔓) at the top of the Swagger UI
4. Enter the token in the format: `Bearer <your-token-here>`
5. Click **"Authorize"** to save
6. You can now test all protected endpoints

### API Modules

The API is organized into the following modules:

- **Auth** - User registration and authentication
- **Customers** - Customer management (CRUD operations)
- **Products** - Product/service management
- **Projects** - Project tracking and management
- **Invoices** - Invoice management with AI features
  - OCR invoice processing
  - Auto-matching with products/customers
  - File upload support

The API will be available at `http://localhost:3000/api`

## Docker Deployment

1. Make sure Docker and Docker Compose are installed

2. Set your Gemini API key:
```bash
export GEMINI_API_KEY=your-api-key-here
```

3. Start all services:
```bash
docker-compose up --build
```

Services:
- Backend API: `http://localhost:3000/api`
- PostgreSQL: `localhost:5432`
- Nginx: `http://localhost:80`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Invoices
- `POST /api/invoices` - Create invoice
- `POST /api/invoices/upload` - Upload invoice image for OCR
- `GET /api/invoices` - List invoices (with filters)
- `GET /api/invoices/:id` - Get invoice details
- `PATCH /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/public/reconciliation/:token` - Public reconciliation view

### Customers
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer details
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Products
- `POST /api/products` - Create product
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project details
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/public/reconciliation/project/:token` - Public project reconciliation

## Environment Variables

- `DATABASE_HOST` - PostgreSQL host
- `DATABASE_PORT` - PostgreSQL port
- `DATABASE_USER` - PostgreSQL username
- `DATABASE_PASSWORD` - PostgreSQL password
- `DATABASE_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time
- `GEMINI_API_KEY` - Google Gemini API key for OCR
- `PORT` - Server port (default: 3000)
