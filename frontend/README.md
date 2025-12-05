# SIMS Frontend

Smart Invoice Management System - Frontend Application

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- React Query (@tanstack/react-query)
- Axios
- Lucide React (Icons)

## Features

- **Authentication**: Login and Register with JWT
- **Dashboard**: Overview of invoices, projects, products, and customers
- **Invoice Management**:
  - List, create, view, edit, and delete invoices
  - Camera/image upload for invoice scanning
  - AI-powered information extraction from invoice images
  - Two-tab verification UI (image vs extracted data)
  - Create reconciliation links for customers
- **Project Management**: Manage projects with AI extraction support
- **Product Management**: View and manage products
- **Customer Management**: View and manage customers

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_URL=http://localhost:3000/api
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── ImageCapture.jsx
│   └── Layout.jsx
├── contexts/          # React contexts
│   └── AuthContext.jsx
├── pages/             # Page components
│   ├── auth/         # Login, Register
│   ├── invoices/     # Invoice CRUD
│   ├── projects/     # Project CRUD
│   ├── products/     # Product views
│   ├── customers/    # Customer views
│   └── Dashboard.jsx
├── services/          # API services
│   └── api.js
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Design System

### Colors
- Primary: #2563EB (Blue)
- Secondary: #3B82F6 (Light Blue)
- CTA: #F97316 (Orange)
- Background: #F8FAFC (Light Gray)
- Text: #1E293B (Dark Slate)
- Border: #E2E8F0 (Light Border)

### Typography
- Headings: Poppins
- Body: Open Sans

### UI Style
- Soft UI Evolution with glassmorphism
- Professional, modern, and clean design
- Accessible (WCAG AA+)
- Smooth transitions (150-300ms)

## API Integration

The app connects to the backend API at the URL specified in `VITE_API_URL`. All API calls include JWT authentication tokens stored in localStorage.

### API Services

- `authService`: Login, register, logout
- `invoiceService`: Invoice CRUD, image upload, AI extraction
- `projectService`: Project CRUD, AI extraction
- `productService`: Product CRUD
- `customerService`: Customer CRUD
