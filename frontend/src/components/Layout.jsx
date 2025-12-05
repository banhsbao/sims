import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Package,
  Users,
  LogOut
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { path: '/invoices', icon: FileText, label: 'Hóa đơn' },
    { path: '/projects', icon: FolderKanban, label: 'Dự án' },
    { path: '/products', icon: Package, label: 'Sản phẩm' },
    { path: '/customers', icon: Users, label: 'Khách hàng' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-4 left-4 right-4 bg-white/80 backdrop-blur-sm border border-border rounded-2xl shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-2xl font-heading font-bold text-primary">
                SIMS
              </Link>

              <div className="hidden md:flex items-center space-x-1">
                {navItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                      isActive(path)
                        ? 'bg-primary text-white'
                        : 'text-text hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-text hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium hidden md:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
