import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Package } from 'lucide-react';
import { productService } from '../../services/api';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().then(res => res.data),
  });

  const filteredProducts = products?.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">Quản lý sản phẩm</h1>
          <p className="text-text/60">Danh sách tất cả sản phẩm</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-text mb-2">{product.name}</h3>
                <p className="text-text/60 text-sm">{product.description || 'Không có mô tả'}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Package className="w-16 h-16 text-text/20 mx-auto mb-4" />
            <p className="text-text/60 text-lg">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
