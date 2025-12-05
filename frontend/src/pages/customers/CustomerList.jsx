import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { customerService } from '../../services/api';

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getAll().then(res => res.data),
  });

  const filteredCustomers = customers?.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">Quản lý khách hàng</h1>
          <p className="text-text/60">Danh sách tất cả khách hàng</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Link
                key={customer.id}
                to={`/customers/${customer.id}`}
                className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-text mb-2">{customer.name}</h3>
                <p className="text-text/60 text-sm">{customer.address || 'Không có địa chỉ'}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Users className="w-16 h-16 text-text/20 mx-auto mb-4" />
            <p className="text-text/60 text-lg">Không tìm thấy khách hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
