import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, FileText } from 'lucide-react';
import { projectService } from '../../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getById(id).then(res => res.data),
  });

  const { data: invoices } = useQuery({
    queryKey: ['project-invoices', id],
    queryFn: () => projectService.getInvoices(id).then(res => res.data),
  });

  if (isLoading) return <div className="py-12 text-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div></div>;
  if (!project) return <div className="py-12 text-center"><p className="text-text/60">Không tìm thấy dự án</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/projects')} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"><ArrowLeft className="w-6 h-6 text-text" /></button>
          <div><h1 className="text-3xl font-heading font-bold text-text mb-2">{project.name}</h1><p className="text-text/60">{project.description}</p></div>
        </div>
        <Link to={`/projects/${id}/edit`} className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg flex items-center space-x-2 cursor-pointer"><Edit className="w-5 h-5" /><span>Chỉnh sửa</span></Link>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <h2 className="text-xl font-heading font-semibold text-text mb-6">Thông tin dự án</h2>
        <div className="grid grid-cols-2 gap-6">
          <div><p className="text-sm text-text/60 mb-1">Khách hàng</p><p className="text-text font-medium">{project.customerName || 'Chưa có'}</p></div>
          <div><p className="text-sm text-text/60 mb-1">Ngày tạo</p><p className="text-text font-medium">{new Date(project.createdAt).toLocaleDateString('vi-VN')}</p></div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <h2 className="text-xl font-heading font-semibold text-text mb-6">Hóa đơn liên quan</h2>
        {invoices?.length > 0 ? (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Link key={invoice.id} to={`/invoices/${invoice.id}`} className="block p-4 border border-border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div><p className="font-medium text-text">{invoice.customerName}</p><p className="text-sm text-text/60">{new Date(invoice.createdAt).toLocaleDateString('vi-VN')}</p></div>
                  </div>
                  <p className="font-semibold text-text">{invoice.totalAmount?.toLocaleString('vi-VN')} đ</p>
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

export default ProjectDetail;
