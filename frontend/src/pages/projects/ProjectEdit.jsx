import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { projectService } from '../../services/api';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', description: '', customerName: '' });

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getById(id).then(res => res.data),
  });

  useEffect(() => {
    if (project) setFormData({ name: project.name || '', description: project.description || '', customerName: project.customerName || '' });
  }, [project]);

  const updateMutation = useMutation({
    mutationFn: (data) => projectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id]);
      navigate(`/projects/${id}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="py-12 text-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(`/projects/${id}`)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="text-3xl font-heading font-bold text-text">Chỉnh sửa dự án</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div><label className="block text-sm font-medium text-text mb-2">Tên dự án</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div><label className="block text-sm font-medium text-text mb-2">Mô tả</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows="4" /></div>
          <div><label className="block text-sm font-medium text-text mb-2">Tên khách hàng</label><input type="text" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate(`/projects/${id}`)} className="border border-border hover:bg-gray-100 text-text font-medium px-8 py-3 rounded-lg cursor-pointer">Hủy</button>
            <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg cursor-pointer flex items-center space-x-2"><Save className="w-5 h-5" /><span>Lưu thay đổi</span></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEdit;
