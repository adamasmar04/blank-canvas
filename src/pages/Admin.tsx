import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { TemplatesManager } from '@/components/admin/TemplatesManager';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { TeamManager } from '@/components/admin/TeamManager';
import { SettingsManager } from '@/components/admin/SettingsManager';

const Admin = () => {
  const { isDesignerOrAbove, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isDesignerOrAbove()) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="templates" element={<TemplatesManager />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="team" element={<TeamManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;