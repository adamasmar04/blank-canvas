import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Megaphone, 
  Users, 
  BarChart3, 
  TrendingUp,
  Eye,
  Plus,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  totalUsers: number;
  totalViews: number;
}

export const AdminDashboard = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalAds: 0,
    activeAds: 0,
    pendingAds: 0,
    totalUsers: 0,
    totalViews: 0
  });
  const [recentAds, setRecentAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch ads stats
        const { data: ads } = await supabase
          .from('ads')
          .select('status, views');

        // Fetch user count
        const { data: users } = await supabase
          .from('user_roles')
          .select('id');

        // Fetch recent ads
        const { data: recent } = await supabase
          .from('ads')
          .select('id, headline, business_name, status, views, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (ads) {
          setStats({
            totalAds: ads.length,
            activeAds: ads.filter(a => a.status === 'active').length,
            pendingAds: ads.filter(a => a.status === 'pending').length,
            totalUsers: users?.length || 0,
            totalViews: ads.reduce((sum, a) => sum + (a.views || 0), 0)
          });
        }

        setRecentAds(recent || []);
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
      title: 'Xayeysiisyada Guud',
      value: stats.totalAds,
      icon: Megaphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      title: 'Kuwa Firfircoon',
      value: stats.activeAds,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      title: 'Sugitaanka',
      value: stats.pendingAds,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    },
    {
      title: 'Isticmaalayaasha',
      value: stats.totalUsers,
      icon: Users,
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
            Ku soo dhawoow! Halkan waxaad ka arki kartaa xogta guud.
          </p>
        </div>
        
        {userRole && (
          <Badge variant="outline" className="text-sm">
            <Shield className="h-3 w-3 mr-1" />
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

      {/* Total Views Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            Aragtida Guud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground">
            {stats.totalViews.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Tirada guud ee aragtida xayeysiisyada
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Ads */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ficilada Degdegga ah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/ads')}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              Maaree Xayeysiisyada
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Maaree Isticmaalayaasha
            </Button>

            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/analytics')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Arag Analytics-ka
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xayeysiisyada Ugu Dambeeyay</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAds.length > 0 ? (
              <div className="space-y-3">
                {recentAds.map((ad) => (
                  <div key={ad.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-foreground">{ad.headline}</p>
                      <p className="text-xs text-muted-foreground">{ad.business_name}</p>
                    </div>
                    <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                      {ad.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Wali ma jiraan xayeysiisyo
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
