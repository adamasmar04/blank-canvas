import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Palette, 
  Users, 
  BarChart3, 
  TrendingUp,
  FileImage,
  Star,
  Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalTemplates: number;
  publishedTemplates: number;
  pendingTemplates: number;
  totalUsage: number;
  topTemplate: { name: string; usage_count: number } | null;
}

export const AdminDashboard = () => {
  const { userRole, isManagerOrAbove } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalTemplates: 0,
    publishedTemplates: 0,
    pendingTemplates: 0,
    totalUsage: 0,
    topTemplate: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch template stats
        const { data: templates } = await supabase
          .from('templates')
          .select('status, usage_count, name');

        if (templates) {
          const totalTemplates = templates.length;
          const publishedTemplates = templates.filter(t => t.status === 'published').length;
          const pendingTemplates = templates.filter(t => t.status === 'pending').length;
          const totalUsage = templates.reduce((sum, t) => sum + t.usage_count, 0);
          
          // Find most used template
          const topTemplate = templates.reduce((top, current) => 
            (current.usage_count > (top?.usage_count || 0)) ? current : top, null);

          setStats({
            totalTemplates,
            publishedTemplates,
            pendingTemplates,
            totalUsage,
            topTemplate
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Templates',
      value: stats.totalTemplates,
      icon: Palette,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      title: 'Published',
      value: stats.publishedTemplates,
      icon: FileImage,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      title: 'Pending Review',
      value: stats.pendingTemplates,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    },
    {
      title: 'Total Usage',
      value: stats.totalUsage,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your templates.
          </p>
        </div>
        
        {userRole && (
          <Badge variant="outline" className="text-sm">
            {userRole.role.replace('_', ' ').toUpperCase()}
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Most Popular Template */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Most Used Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topTemplate ? (
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  {stats.topTemplate.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Used {stats.topTemplate.usage_count} times
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No templates used yet</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/templates/create')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Template
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/templates')}
            >
              <Palette className="mr-2 h-4 w-4" />
              Manage Templates
            </Button>
            
            {isManagerOrAbove() && (
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/team')}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Activity tracking will appear here once implemented
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};