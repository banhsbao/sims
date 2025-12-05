import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { projectService } from '../../services/api';

const ProjectList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll().then(res => res.data),
  });

  const filteredProjects = projects?.filter(project =>
    project.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text mb-2">Quản lý dự án</h1>
          <p className="text-text/60">Danh sách tất cả dự án</p>
        </div>
        <Link
          to="/projects/create"
          className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo dự án mới</span>
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
          <input
            type="text"
            placeholder="Tìm kiếm dự án..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-heading font-semibold text-text mb-2">{project.name}</h3>
                <p className="text-text/60 text-sm mb-4 line-clamp-2">{project.description || 'Không có mô tả'}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text/60">Khách hàng</span>
                  <span className="font-medium text-text">{project.customerName || 'Chưa có'}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <FolderKanban className="w-16 h-16 text-text/20 mx-auto mb-4" />
            <p className="text-text/60 text-lg">Không tìm thấy dự án nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
