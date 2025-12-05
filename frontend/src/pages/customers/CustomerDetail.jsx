import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { customerService } from '../../services/api';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getById(id).then(res => res.data),
  });

  const { data: invoices } = useQuery({
    queryKey: ['customer-invoices', id],
    queryFn: () => customerService.getInvoices(id).then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="py-12 text-center">
        <p className="text-text/60">Không tìm thấy khách hàng</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/customers')}
          className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 text-text" />
        </button>
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">{customer.name}</h1>
          <p className="text-text/60">{customer.address}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <h2 className="text-xl font-heading font-semibold text-text mb-6">Thông tin khách hàng</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-text/60 mb-1">Tên khách hàng</p>
            <p className="text-text font-medium">{customer.name}</p>
          </div>
          <div>
            <p className="text-sm text-text/60 mb-1">Địa chỉ</p>
            <p className="text-text font-medium">{customer.address || 'Không có'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <h2 className="text-xl font-heading font-semibold text-text mb-6">Hóa đơn liên quan</h2>
        {invoices?.length > 0 ? (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Link
                key={invoice.id}
                to={`/invoices/${invoice.id}`}
                className="block p-4 border border-border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-text">
                        Hóa đơn #{invoice.invoiceNumber || invoice.id}
                      </p>
                      <p className="text-sm text-text/60">
                        {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text">
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
          <p className="text-text/60 text-center py-8">Chưa có hóa đơn nào</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
