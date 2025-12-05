import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, X, ImageIcon } from 'lucide-react';
import ImageCapture from '../../components/ImageCapture';
import { invoiceService } from '../../services/api';

const InvoiceCreate = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    products: [{ name: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    totalAmount: 0,
    paid: 0,
    debt: 0,
    status: 'pending',
  });
  const [activeTab, setActiveTab] = useState('image');
  const [isExtracting, setIsExtracting] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const extractMutation = useMutation({
    mutationFn: (formData) => invoiceService.extractInfo(formData),
    onSuccess: (response) => {
      const data = response.data;
      setExtractedData(data);
      setFormData({
        customerName: data.customerName || '',
        address: data.address || '',
        products: data.products?.length > 0 ? data.products : [{ name: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
        totalAmount: data.totalAmount || 0,
        paid: data.paid || 0,
        debt: data.debt || 0,
        status: 'pending',
      });
      setActiveTab('data');
      setIsExtracting(false);
    },
    onError: (error) => {
      alert('Lỗi khi trích xuất thông tin: ' + (error.response?.data?.message || error.message));
      setIsExtracting(false);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => invoiceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      navigate('/invoices');
    },
    onError: (error) => {
      alert('Lỗi khi tạo hóa đơn: ' + (error.response?.data?.message || error.message));
    },
  });

  const handleImageCapture = async (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setShowCamera(false);

    setIsExtracting(true);
    const formData = new FormData();
    formData.append('image', file);
    extractMutation.mutate(formData);
  };

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
    const dataToSubmit = {
      ...formData,
      imageUrl: imagePreview,
    };
    createMutation.mutate(dataToSubmit);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">Tạo hóa đơn mới</h1>
          <p className="text-text/60">Chụp ảnh hoặc nhập thông tin hóa đơn thủ công</p>
        </div>
        <button
          onClick={() => navigate('/invoices')}
          className="border border-border hover:bg-gray-100 text-text font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
        >
          <X className="w-5 h-5" />
          <span>Hủy</span>
        </button>
      </div>

      {!imageFile && (
        <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-12 text-center">
          <Camera className="w-16 h-16 text-text/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-text mb-2">Chưa có ảnh hóa đơn</h3>
          <p className="text-text/60 mb-6">Chụp ảnh hoặc tải lên ảnh hóa đơn để tự động trích xuất thông tin</p>
          <button
            onClick={() => setShowCamera(true)}
            className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2 cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>Chụp ảnh hóa đơn</span>
          </button>
        </div>
      )}

      {imageFile && (
        <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl overflow-hidden">
          <div className="border-b border-border">
            <div className="flex">
              <button
                onClick={() => setActiveTab('image')}
                className={`flex-1 px-6 py-4 font-medium transition-colors duration-200 cursor-pointer ${
                  activeTab === 'image'
                    ? 'bg-primary text-white'
                    : 'text-text hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Hình ảnh</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`flex-1 px-6 py-4 font-medium transition-colors duration-200 cursor-pointer ${
                  activeTab === 'data'
                    ? 'bg-primary text-white'
                    : 'text-text hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>Thông tin đã trích xuất</span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'image' && (
              <div>
                <img src={imagePreview} alt="Invoice" className="w-full rounded-lg" />
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setExtractedData(null);
                      setActiveTab('image');
                    }}
                    className="border border-border hover:bg-gray-100 text-text font-medium px-6 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Chọn ảnh khác
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {isExtracting ? (
                  <div className="py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-text/60">Đang trích xuất thông tin từ ảnh...</p>
                  </div>
                ) : (
                  <>
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
                        onClick={() => navigate('/invoices')}
                        className="border border-border hover:bg-gray-100 text-text font-medium px-8 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>{createMutation.isPending ? 'Đang lưu...' : 'Lưu hóa đơn'}</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {showCamera && (
        <ImageCapture
          onImageCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default InvoiceCreate;
