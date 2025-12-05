import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FileText,
  FolderKanban,
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { invoiceService, projectService, productService, customerService } from '../services/api';

const Dashboard = () => {
  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoiceService.getAll().then(res => res.data),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll().then(res => res.data),
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().then(res => res.data),
  });

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getAll().then(res => res.data),
  });

  const stats = [
    {
      label: 'Tổng hóa đơn',
      value: invoices?.length || 0,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/invoices',
    },
    {
      label: 'Dự án',
      value: projects?.length || 0,
      icon: FolderKanban,
      color: 'bg-purple-500',
      link: '/projects',
    },
    {
      label: 'Sản phẩm',
      value: products?.length || 0,
      icon: Package,
      color: 'bg-green-500',
      link: '/products',
    },
    {
      label: 'Khách hàng',
      value: customers?.length || 0,
      icon: Users,
      color: 'bg-orange-500',
      link: '/customers',
    },
  ];

  const getInvoiceStats = () => {
    if (!invoices) return { pending: 0, paid: 0, cancelled: 0 };

    return {
      pending: invoices.filter(inv => inv.status === 'pending').length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      cancelled: invoices.filter(inv => inv.status === 'cancelled').length,
    };
  };

  const invoiceStats = getInvoiceStats();

  const recentInvoices = invoices?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-text mb-2">Tổng quan</h1>
        <p className="text-text/60">Chào mừng bạn đến với SIMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-heading font-bold text-text">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-heading font-semibold">Chờ thanh toán</h2>
          </div>
          <p className="text-4xl font-heading font-bold text-text">{invoiceStats.pending}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-heading font-semibold">Đã thanh toán</h2>
          </div>
          <p className="text-4xl font-heading font-bold text-text">{invoiceStats.paid}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-heading font-semibold">Đã hủy</h2>
          </div>
          <p className="text-4xl font-heading font-bold text-text">{invoiceStats.cancelled}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-semibold">Hóa đơn gần đây</h2>
            <Link
              to="/invoices"
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
            >
              Xem tất cả
            </Link>
          </div>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="divide-y divide-border">
            {recentInvoices.map((invoice) => (
              <Link
                key={invoice.id}
                to={`/invoices/${invoice.id}`}
                className="block p-6 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-text mb-1">{invoice.customerName || 'Không có tên'}</p>
                    <p className="text-sm text-text/60">
                      {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text mb-1">
                      {invoice.totalAmount?.toLocaleString('vi-VN')} đ
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {invoice.status === 'paid'
                        ? 'Đã thanh toán'
                        : invoice.status === 'pending'
                        ? 'Chờ thanh toán'
                        : 'Đã hủy'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-text/20 mx-auto mb-4" />
            <p className="text-text/60">Chưa có hóa đơn nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
