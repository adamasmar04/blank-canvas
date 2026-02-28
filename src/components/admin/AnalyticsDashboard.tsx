import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, TrendingUp, Users, Eye, Megaphone } from 'lucide-react';
import { toast } from 'sonner';

export const AnalyticsDashboard = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAds: 0,
    totalViews: 0,
    activeAds: 0,
    avgViews: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('id, headline, business_name, status, views, package_type, industry, created_at')
        .order('views', { ascending: false });

      if (error) throw error;

      const adsData = data || [];
      setAds(adsData);

      const totalViews = adsData.reduce((sum, a) => sum + (a.views || 0), 0);
      setStats({
        totalAds: adsData.length,
        totalViews,
        activeAds: adsData.filter(a => a.status === 'active').length,
        avgViews: adsData.length > 0 ? Math.round(totalViews / adsData.length) : 0
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Group by industry
  const industryStats = ads.reduce((acc, ad) => {
    const key = ad.industry || 'Other';
    if (!acc[key]) acc[key] = { count: 0, views: 0 };
    acc[key].count++;
    acc[key].views += ad.views || 0;
    return acc;
  }, {} as Record<string, { count: number; views: number }>);

  // Group by package type
  const packageStats = ads.reduce((acc, ad) => {
    const key = ad.package_type || 'basic';
    if (!acc[key]) acc[key] = { count: 0, views: 0 };
    acc[key].count++;
    acc[key].views += ad.views || 0;
    return acc;
  }, {} as Record<string, { count: number; views: number }>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Xogta guud ee xayeysiisyada</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wadarta Xayeysiisyada</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wadarta Aragtida</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Firfircoon</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celceliska Aragtida</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgViews}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Warshadaha</CardTitle>
            <CardDescription>Xayeysiisyada qayb qayb</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(industryStats)
                .sort(([, a], [, b]) => b.views - a.views)
                .map(([industry, data]) => (
                  <div key={industry} className="flex items-center justify-between">
                    <span className="font-medium">{industry}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{data.count} ads</Badge>
                      <Badge>{data.views} views</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Package Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Noocyada Xidhmada</CardTitle>
            <CardDescription>Isticmaalka nooc kasta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(packageStats)
                .sort(([, a], [, b]) => b.count - a.count)
                .map(([pkg, data]) => (
                  <div key={pkg} className="flex items-center justify-between">
                    <span className="font-medium capitalize">{pkg}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{data.count} ads</Badge>
                      <Badge>{data.views} views</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Ads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Xayeysiisyada Ugu Caansan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Xayeysiiska</TableHead>
                <TableHead>Ganacsiga</TableHead>
                <TableHead>Aragtida</TableHead>
                <TableHead>Xaaladda</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.slice(0, 10).map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.headline}</TableCell>
                  <TableCell>{ad.business_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {ad.views || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                      {ad.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
