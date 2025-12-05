import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, ExternalLink, ImageIcon, X } from 'lucide-react';
import { useState } from 'react';
import { invoiceService } from '../../services/api';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showImage, setShowImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getById(id).then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: () => invoiceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      navigate('/invoices');
    },
    onError: (error) => {
      alert('Lỗi khi xóa hóa đơn: ' + (error.response?.data?.message || error.message));
    },
  });

  const createLinkMutation = useMutation({
    mutationFn: () => invoiceService.createReconciliationLink(id),
    onSuccess: (response) => {
      const link = response.data.link;
      navigator.clipboard.writeText(link);
      alert('Đã sao chép link đối chiếu vào clipboard!');
    },
    onError: (error) => {
      alert('Lỗi khi tạo link đối chiếu: ' + (error.response?.data?.message || error.message));
    },
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="py-12 text-center">
        <p className="text-text/60">Không tìm thấy hóa đơn</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/invoices')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-text" />
          </button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text mb-2">
              Hóa đơn #{invoice.invoiceNumber || invoice.id}
            </h1>
            <p className="text-text/60">
              Ngày tạo: {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {invoice.imageUrl && (
            <button
              onClick={() => setShowImage(true)}
              className="border border-border hover:bg-gray-100 text-text font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Xem ảnh</span>
            </button>
          )}

          <button
            onClick={() => createLinkMutation.mutate()}
            disabled={createLinkMutation.isPending}
            className="border border-border hover:bg-gray-100 text-text font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Tạo link đối chiếu</span>
          </button>

          <Link
            to={`/invoices/${id}/edit`}
            className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
          >
            <Edit className="w-5 h-5" />
            <span>Chỉnh sửa</span>
          </Link>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
            <span>Xóa</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <h2 className="text-xl font-heading font-semibold text-text mb-6">Thông tin khách hàng</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-text/60 mb-1">Tên khách hàng</p>
                <p className="text-text font-medium">{invoice.customerName || 'Không có'}</p>
              </div>
              <div>
                <p className="text-sm text-text/60 mb-1">Địa chỉ</p>
                <p className="text-text font-medium">{invoice.address || 'Không có'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <h2 className="text-xl font-heading font-semibold text-text mb-6">Danh sách sản phẩm</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-heading font-semibold text-text">Sản phẩm</th>
                    <th className="text-center py-3 px-2 font-heading font-semibold text-text">SL</th>
                    <th className="text-right py-3 px-2 font-heading font-semibold text-text">Đơn giá</th>
                    <th className="text-right py-3 px-2 font-heading font-semibold text-text">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.products?.map((product, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-3 px-2 text-text">{product.name}</td>
                      <td className="py-3 px-2 text-center text-text">{product.quantity}</td>
                      <td className="py-3 px-2 text-right text-text">
                        {product.unitPrice?.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-text">
                        {product.totalPrice?.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <h2 className="text-xl font-heading font-semibold text-text mb-6">Tổng quan</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-text/60">Tổng tiền</span>
                <span className="text-lg font-semibold text-text">
                  {invoice.totalAmount?.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-text/60">Đã trả</span>
                <span className="text-lg font-semibold text-green-600">
                  {invoice.paid?.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-text/60">Nợ</span>
                <span className="text-lg font-semibold text-red-600">
                  {invoice.debt?.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text/60">Trạng thái</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          </div>
        </div>
      </div>

      {showImage && invoice.imageUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowImage(false)}
              className="absolute -top-12 right-0 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              <X className="w-6 h-6 text-text" />
            </button>
            <img src={invoice.imageUrl} alt="Invoice" className="w-full rounded-lg" />
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-heading font-semibold text-text mb-4">Xác nhận xóa</h3>
            <p className="text-text/60 mb-6">
              Bạn có chắc chắn muốn xóa hóa đơn này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-border hover:bg-gray-100 text-text font-medium py-3 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate();
                  setShowDeleteConfirm(false);
                }}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 cursor-pointer"
              >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;
