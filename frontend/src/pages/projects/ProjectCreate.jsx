import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Save, X, Camera } from 'lucide-react';
import ImageCapture from '../../components/ImageCapture';
import { projectService } from '../../services/api';

const ProjectCreate = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', customerName: '' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => projectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      navigate('/projects');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-text">Tạo dự án mới</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Tên dự án</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Mô tả</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows="4" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Tên khách hàng</label>
            <input type="text" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/projects')} className="border border-border hover:bg-gray-100 text-text font-medium px-8 py-3 rounded-lg cursor-pointer">Hủy</button>
            <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg cursor-pointer flex items-center space-x-2"><Save className="w-5 h-5" /><span>Lưu dự án</span></button>
          </div>
        </form>
      </div>
      {showCamera && <ImageCapture onImageCapture={(file) => { setImageFile(file); setShowCamera(false); }} onClose={() => setShowCamera(false)} />}
    </div>
  );
};

export default ProjectCreate;
