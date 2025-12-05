import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceCreate from './pages/invoices/InvoiceCreate';
import InvoiceDetail from './pages/invoices/InvoiceDetail';
import InvoiceEdit from './pages/invoices/InvoiceEdit';
import ProjectList from './pages/projects/ProjectList';
import ProjectCreate from './pages/projects/ProjectCreate';
import ProjectDetail from './pages/projects/ProjectDetail';
import ProjectEdit from './pages/projects/ProjectEdit';
import ProductList from './pages/products/ProductList';
import ProductDetail from './pages/products/ProductDetail';
import CustomerList from './pages/customers/CustomerList';
import CustomerDetail from './pages/customers/CustomerDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="invoices" element={<InvoiceList />} />
              <Route path="invoices/create" element={<InvoiceCreate />} />
              <Route path="invoices/:id" element={<InvoiceDetail />} />
              <Route path="invoices/:id/edit" element={<InvoiceEdit />} />

              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/create" element={<ProjectCreate />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="projects/:id/edit" element={<ProjectEdit />} />

              <Route path="products" element={<ProductList />} />
              <Route path="products/:id" element={<ProductDetail />} />

              <Route path="customers" element={<CustomerList />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
