import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { invoiceService } from '../../services/api';

const InvoiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    products: [{ name: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    totalAmount: 0,
    paid: 0,
    debt: 0,
    status: 'pending',
  });

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getById(id).then(res => res.data),
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        customerName: invoice.customerName || '',
        address: invoice.address || '',
        products: invoice.products?.length > 0 ? invoice.products : [{ name: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
        totalAmount: invoice.totalAmount || 0,
        paid: invoice.paid || 0,
        debt: invoice.debt || 0,
        status: invoice.status || 'pending',
      });
    }
  }, [invoice]);

  const updateMutation = useMutation({
    mutationFn: (data) => invoiceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoice', id]);
      queryClient.invalidateQueries(['invoices']);
      navigate(`/invoices/${id}`);
    },
    onError: (error) => {
      alert('Lỗi khi cập nhật hóa đơn: ' + (error.response?.data?.message || error.message));
    },
  });

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;

    if (field === 'quantity' || field === 'unitPrice') {
      newProducts[index].totalPrice = newProducts[index].quantity * newProducts[index].unitPrice;
    }

    const totalAmount = newProducts.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
    const debt = totalAmount - formData.paid;

    setFormData({ ...formData, products: newProducts, totalAmount, debt });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    });
  };

  const removeProduct = (index) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    const totalAmount = newProducts.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
    const debt = totalAmount - formData.paid;
    setFormData({ ...formData, products: newProducts, totalAmount, debt });
  };

  const handlePaidChange = (value) => {
    const paid = parseFloat(value) || 0;
    const debt = formData.totalAmount - paid;
    setFormData({ ...formData, paid, debt });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/invoices/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-text" />
          </button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text mb-2">Chỉnh sửa hóa đơn</h1>
            <p className="text-text/60">Cập nhật thông tin hóa đơn</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Tên khách hàng
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Địa chỉ
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-text">Sản phẩm</label>
              <button
                type="button"
                onClick={addProduct}
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
              >
                + Thêm sản phẩm
              </button>
            </div>

            <div className="space-y-4">
              {formData.products.map((product, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <input
                    type="text"
                    placeholder="Tên sản phẩm"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    required
                    className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="number"
                    placeholder="SL"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    required
                    min="0"
                    className="w-24 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="number"
                    placeholder="Đơn giá"
                    value={product.unitPrice}
                    onChange={(e) => handleProductChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    required
                    min="0"
                    className="w-32 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="number"
                    value={product.totalPrice}
                    readOnly
                    className="w-32 px-4 py-3 border border-border rounded-lg bg-gray-50 text-text/60"
                  />
                  {formData.products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Tổng tiền
              </label>
              <input
                type="number"
                value={formData.totalAmount}
                readOnly
                className="w-full px-4 py-3 border border-border rounded-lg bg-gray-50 text-text/60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Đã trả
              </label>
              <input
                type="number"
                value={formData.paid}
                onChange={(e) => handlePaidChange(e.target.value)}
                min="0"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Nợ
              </label>
              <input
                type="number"
                value={formData.debt}
                readOnly
                className="w-full px-4 py-3 border border-border rounded-lg bg-gray-50 text-text/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 cursor-pointer"
            >
              <option value="pending">Chờ thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/invoices/${id}`)}
              className="border border-border hover:bg-gray-100 text-text font-medium px-8 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceEdit;
