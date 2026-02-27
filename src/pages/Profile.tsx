import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Clock, Edit, Trash2, Plus, BarChart3, TrendingUp, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
const Profile = () => {
  const {
    user
  } = useAuth();

  // Fetch user profile data
  const {
    data: profile,
    isLoading: profileLoading
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch user's ads
  const {
    data: userAds,
    isLoading: adsLoading
  } = useQuery({
    queryKey: ['user-ads', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const {
        data,
        error
      } = await supabase.from('ads').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  const getTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    if (diffMs <= 0) return 'Expired';
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor(diffMs % (1000 * 60 * 60) / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  // Calculate stats from real data
  const totalViews = userAds?.reduce((sum, ad) => sum + (ad.views || 0), 0) || 0;
  const activeCampaigns = userAds?.filter(ad => ad.status === 'active' && new Date(ad.expires_at) > new Date()).length || 0;
  const totalAds = userAds?.length || 0;
  const stats = [{
    label: "Total Views",
    value: totalViews.toLocaleString(),
    icon: Eye,
    color: "text-blue-600"
  }, {
    label: "Active Campaigns",
    value: activeCampaigns,
    icon: TrendingUp,
    color: "text-green-600"
  }, {
    label: "Total Ads",
    value: totalAds,
    icon: BarChart3,
    color: "text-purple-600"
  }];
  const getPackageColor = (packageType: string) => {
    switch (packageType.toLowerCase()) {
      case 'premium':
        return 'bg-blue-500';
      case 'standard':
        return 'bg-yellow-500';
      case 'basic':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  if (profileLoading || adsLoading) {
    return <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          <span className="ml-2 text-gray-600">Loading profile...</span>
        </div>
      </div>;
  }
  return <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="glass-card border-white/20 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold gradient-text mb-2">
                    {profile?.business_name || 'Your Business'}
                  </h1>
                  <p className="text-xl text-gray-600 mb-2">{user?.email}</p>
                  <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                    {profile?.business_number && <span>📞 {profile.business_number}</span>}
                    {profile?.business_location && <span>📍 {profile.business_location}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="glass-button text-gray-800 hover:text-gray-900">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Link to="/create">
                    <Button className="glass-button text-gray-800 hover:text-gray-900">
                      <Plus className="w-4 h-4 mr-2" />
                      New Ad
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => <Card key={index} className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                    </div>
                    <div className={`glass-button w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          {/* My Ads */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl gradient-text">My Advertisements</CardTitle>
                <Link to="/create">
                  
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {userAds && userAds.length > 0 ? userAds.map(ad => <Card key={ad.id} className="glass-card border-white/20 hover:scale-[1.02] transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {ad.image_url ? <img src={ad.image_url} alt={ad.headline} className="w-full md:w-32 h-32 object-cover rounded-lg" /> : <div className="w-full md:w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                            {ad.business_name.charAt(0)}
                          </div>}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold gradient-text line-clamp-2">
                              {ad.headline}
                            </h3>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge className={`${getPackageColor(ad.package_type)} text-white text-xs`}>
                                {ad.package_type}
                              </Badge>
                              <Badge variant={ad.status === 'active' && new Date(ad.expires_at) > new Date() ? 'default' : 'secondary'} className={ad.status === 'active' && new Date(ad.expires_at) > new Date() ? 'bg-green-500 text-white' : 'glass-button'}>
                                {ad.status === 'active' && new Date(ad.expires_at) > new Date() ? 'Active' : 'Expired'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Eye className="w-4 h-4" />
                              <span>{(ad.views || 0).toLocaleString()} views</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{getTimeLeft(ad.expires_at)}</span>
                            </div>
                          </div>

                          {ad.status === 'active' && new Date(ad.expires_at) > new Date() && <div className="mb-4">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                <span>Time Progress</span>
                                <span>{getTimeLeft(ad.expires_at)} remaining</span>
                              </div>
                              <Progress value={getTimeLeft(ad.expires_at).includes('day') ? 60 : 20} className="h-2" />
                            </div>}
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              Created {new Date(ad.created_at || '').toLocaleDateString()}
                            </p>
                            <div className="flex gap-2">
                              <Link to={`/ad/${ad.id}`}>
                                <Button size="sm" variant="outline" className="glass-button border-white/30">
                                  View
                                </Button>
                              </Link>
                              {ad.status === 'active' && new Date(ad.expires_at) > new Date() && <>
                                  <Button size="sm" variant="outline" className="glass-button border-white/30">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="glass-button border-white/30 text-red-600 hover:text-red-700">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>) : <div className="text-center py-12">
                    <div className="glass-button w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No ads yet</h3>
                    <p className="text-gray-500 mb-6">Create your first advertisement to get started</p>
                    <Link to="/create">
                      <Button className="glass-button text-gray-800 hover:text-gray-900">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Ad
                      </Button>
                    </Link>
                  </div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default Profile;