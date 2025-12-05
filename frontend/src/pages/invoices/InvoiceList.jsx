import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, Calendar } from 'lucide-react';
import { invoiceService } from '../../services/api';

const InvoiceList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', searchTerm, searchDate],
    queryFn: () => invoiceService.getAll({ search: searchTerm, date: searchDate }).then(res => res.data),
  });

  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = !searchTerm ||
      invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !searchDate ||
      new Date(invoice.createdAt).toISOString().split('T')[0] === searchDate;

    return matchesSearch && matchesDate;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">Quản lý hóa đơn</h1>
          <p className="text-text/60">Danh sách tất cả hóa đơn trong hệ thống</p>
        </div>
        <Link
          to="/invoices/create"
          className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo hóa đơn mới</span>
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng, số hóa đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          </div>
        ) : filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-heading font-semibold text-text">Số hóa đơn</th>
                  <th className="text-left py-4 px-4 font-heading font-semibold text-text">Khách hàng</th>
                  <th className="text-left py-4 px-4 font-heading font-semibold text-text">Ngày tạo</th>
                  <th className="text-right py-4 px-4 font-heading font-semibold text-text">Tổng tiền</th>
                  <th className="text-center py-4 px-4 font-heading font-semibold text-text">Trạng thái</th>
                  <th className="text-center py-4 px-4 font-heading font-semibold text-text">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-border hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-primary">
                        {invoice.invoiceNumber || `#${invoice.id}`}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-text">{invoice.customerName || 'Không có tên'}</td>
                    <td className="py-4 px-4 text-text/60">
                      {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-text">
                      {invoice.totalAmount?.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-4 px-4 text-center">
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
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <FileText className="w-16 h-16 text-text/20 mx-auto mb-4" />
            <p className="text-text/60 text-lg">Không tìm thấy hóa đơn nào</p>
            <p className="text-text/40 text-sm mt-2">Thử thay đổi bộ lọc tìm kiếm hoặc tạo hóa đơn mới</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
