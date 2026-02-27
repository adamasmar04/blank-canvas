import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, TrendingUp, Users, FileText, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface TemplateAnalytics {
  id: string;
  name: string;
  usage_count: number;
  category: string;
  last_used: string;
  status: string;
}

interface UsageStats {
  totalTemplates: number;
  publishedTemplates: number;
  totalUsage: number;
  topTemplate: string;
}

export const AnalyticsDashboard = () => {
  const [templates, setTemplates] = useState<TemplateAnalytics[]>([]);
  const [stats, setStats] = useState<UsageStats>({
    totalTemplates: 0,
    publishedTemplates: 0,
    totalUsage: 0,
    topTemplate: ''
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
    fetchCategories();
  }, [timeFilter, categoryFilter]);

  const fetchAnalytics = async () => {
    try {
      // Fetch template analytics with usage data
      const { data: templatesData, error: templatesError } = await supabase
        .from('templates')
        .select(`
          id,
          name,
          usage_count,
          status,
          template_categories!inner(name),
          template_usage(used_at)
        `)
        .order('usage_count', { ascending: false });

      if (templatesError) throw templatesError;

      // Process templates data
      const processedTemplates = templatesData?.map(template => ({
        id: template.id,
        name: template.name,
        usage_count: template.usage_count,
        category: template.template_categories?.name || 'Uncategorized',
        last_used: template.template_usage?.[0]?.used_at || '2024-01-01',
        status: template.status
      })) || [];

      setTemplates(processedTemplates);

      // Calculate stats
      const totalTemplates = templatesData?.length || 0;
      const publishedTemplates = templatesData?.filter(t => t.status === 'published').length || 0;
      const totalUsage = templatesData?.reduce((sum, t) => sum + (t.usage_count || 0), 0) || 0;
      const topTemplate = templatesData?.[0]?.name || 'None';

      setStats({
        totalTemplates,
        publishedTemplates,
        totalUsage,
        topTemplate
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('template_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = categoryFilter === 'all' || template.category === categories.find(c => c.id === categoryFilter)?.name;
    return matchesCategory;
  });

  const getUsageColor = (count: number) => {
    if (count >= 50) return 'bg-green-500';
    if (count >= 20) return 'bg-yellow-500';
    if (count >= 5) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getUsageLabel = (count: number) => {
    if (count >= 50) return 'Very Popular';
    if (count >= 20) return 'Popular';
    if (count >= 5) return 'Active';
    return 'Low Usage';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Template usage statistics and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedTemplates} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              Times templates were used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{stats.topTemplate}</div>
            <p className="text-xs text-muted-foreground">
              Top performing template
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTemplates > 0 ? Math.round(stats.totalUsage / stats.totalTemplates) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Uses per template
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="1d">Last 24 Hours</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Usage Table */}
      <Card>
        <CardHeader>
          <CardTitle>Template Performance</CardTitle>
          <CardDescription>
            Detailed usage statistics for all templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Last Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{template.usage_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={template.status === 'published' ? 'default' : 'secondary'}>
                      {template.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getUsageColor(template.usage_count)} text-white`}>
                      {getUsageLabel(template.usage_count)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {template.last_used && template.last_used !== '2024-01-01' ? 
                      new Date(template.last_used).toLocaleDateString() : 
                      'Never'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories
                .map(category => {
                  const categoryTemplates = templates.filter(t => t.category === category.name);
                  const totalUsage = categoryTemplates.reduce((sum, t) => sum + t.usage_count, 0);
                  return { ...category, totalUsage, templateCount: categoryTemplates.length };
                })
                .sort((a, b) => b.totalUsage - a.totalUsage)
                .slice(0, 5)
                .map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{category.icon || '📁'}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{category.templateCount} templates</Badge>
                      <Badge>{category.totalUsage} uses</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates
                .filter(t => t.last_used && t.last_used !== '2024-01-01')
                .sort((a, b) => new Date(b.last_used).getTime() - new Date(a.last_used).getTime())
                .slice(0, 5)
                .map((template) => (
                  <div key={template.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.category}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(template.last_used).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};