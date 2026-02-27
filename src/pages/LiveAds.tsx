import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Clock, MapPin, Heart, Loader2, Save, Share, Phone, ExternalLink, ChevronDown, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import FiltersPanel from "@/components/FiltersPanel";
import CategoryFilter from "@/components/CategoryFilter";
import { formatPrice } from "@/lib/currency";
const LiveAds = () => {
  const {
    toast
  } = useToast();
  const [likedAds, setLikedAds] = useState<Set<string>>(new Set());
  const [savedAds, setSavedAds] = useState<Set<string>>(new Set());
  const [hoveredAdId, setHoveredAdId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  // Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState("Global / All Locations");
  const [packageType, setPackageType] = useState("All Packages");
  const [status, setStatus] = useState("Show Only Active Ads");
  const [duration, setDuration] = useState("All Durations");
  const [sortBy, setSortBy] = useState("Newest First");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const {
    data: ads,
    isLoading,
    error
  } = useQuery({
    queryKey: ['live-ads', status],
    queryFn: async () => {
      // Fetch ads from Supabase (RLS allows public to see active, non-expired)
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const list = data ?? [];

      // Client-side status filter
      if (status === "Show Only Active Ads") {
        return list.filter(ad => ad.status === 'active' && new Date(ad.expires_at) > new Date());
      } else if (status === "Show Expired Ads") {
        return list.filter(ad => new Date(ad.expires_at) <= new Date());
      }

      return list;
    }
  });

  // Auto-slide images on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hoveredAdId) {
      const ad = ads?.find(a => a.id === hoveredAdId);
      if (ad && getAdImages(ad).length > 1) {
        interval = setInterval(() => {
          setCurrentImageIndex(prev => {
            const images = getAdImages(ad);
            const current = prev[hoveredAdId] || 0;
            const next = (current + 1) % images.length;
            return {
              ...prev,
              [hoveredAdId]: next
            };
          });
        }, 1000);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hoveredAdId, ads]);
  const getAdImages = (ad: any) => {
    if (!ad) return [];

    // Check for media_urls array first (multiple images)
    if (ad.media_urls && Array.isArray(ad.media_urls) && ad.media_urls.length > 0) {
      return ad.media_urls.filter((url: string) => url && url.trim());
    }

    // Fallback to image_url for single image
    if (ad.image_url) {
      return ad.image_url.split(',').map((url: string) => url.trim()).filter((url: string) => url);
    }
    return [];
  };
  const getSocialMediaLinks = (ad: any) => {
    if (!ad.social_media) return [];
    try {
      const socialData = typeof ad.social_media === 'string' ? JSON.parse(ad.social_media) : ad.social_media;
      return Object.entries(socialData).filter(([_, url]) => url && url.toString().trim()).map(([platform, url]) => ({
        platform,
        url: url.toString()
      }));
    } catch {
      return [];
    }
  };
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
  const getTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    if (diffMs <= 0) return 'Expired';
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
    } else {
      const diffMinutes = Math.floor(diffMs % (1000 * 60 * 60) / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} left`;
    }
  };
  const handleLike = (adId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newLikedAds = new Set(likedAds);
    if (likedAds.has(adId)) {
      newLikedAds.delete(adId);
      toast({
        title: "Removed from favorites",
        description: "Ad removed from your favorites"
      });
    } else {
      newLikedAds.add(adId);
      toast({
        title: "Added to favorites",
        description: "Ad added to your favorites"
      });
    }
    setLikedAds(newLikedAds);
  };
  const handleSave = (adId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSavedAds = new Set(savedAds);
    if (savedAds.has(adId)) {
      newSavedAds.delete(adId);
      toast({
        title: "Removed from saved",
        description: "Ad removed from your saved list"
      });
    } else {
      newSavedAds.add(adId);
      toast({
        title: "Saved successfully",
        description: "Ad saved for later viewing"
      });
    }
    setSavedAds(newSavedAds);
  };
  const handleShare = (ad: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: ad.headline,
        text: `Check out this ad from ${ad.business_name}`,
        url: `${window.location.origin}/ad/${ad.id}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/ad/${ad.id}`);
      toast({
        title: "Link copied",
        description: "Ad link copied to clipboard"
      });
    }
  };
  const handleViewDetails = async (ad: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Note: Implement view tracking in your backend if needed
    // This would require an API endpoint like PUT /ads/:id/view

    // Navigate to dedicated ad details page
    window.location.href = `/ad/${ad.id}`;
  };
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };
  const handleSocialClick = (url: string) => {
    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
  };
  const filteredAndSortedAds = (() => {
    let filtered = ads?.filter(ad => {
      let matches = true;

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        matches &&= ad.headline.toLowerCase().includes(searchLower) || ad.business_name.toLowerCase().includes(searchLower) || ad.tags?.toLowerCase().includes(searchLower) || ad.hashtags?.toLowerCase().includes(searchLower);
      }

      // Category filter (from filter dropdown)
      if (filterCategory && filterCategory !== "All Categories") {
        matches &&= ad.tags?.toLowerCase().includes(filterCategory.toLowerCase()) || ad.headline.toLowerCase().includes(filterCategory.toLowerCase()) || ad.hashtags?.toLowerCase().includes(filterCategory.toLowerCase());
      }

      // Category filter (from tag buttons)
      if (category && category !== "All Categories") {
        matches &&= ad.tags?.toLowerCase().includes(category.toLowerCase()) || ad.headline.toLowerCase().includes(category.toLowerCase()) || ad.hashtags?.toLowerCase().includes(category.toLowerCase());
      }

      // Location filter
      if (location && location !== "Global / All Locations") {
        matches &&= ad.business_location?.toLowerCase().includes(location.toLowerCase());
      }

      // Package type filter
      if (packageType && packageType !== "All Packages") {
        matches &&= ad.package_type.toLowerCase() === packageType.toLowerCase();
      }

      // Duration filter
      if (duration && duration !== "All Durations") {
        const now = new Date();
        const expiry = new Date(ad.expires_at);
        const diffMs = expiry.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (duration === "Expiring Today") {
          matches &&= diffDays === 0 && diffMs > 0;
        } else if (duration === "Within 3 Days") {
          matches &&= diffDays <= 3 && diffMs > 0;
        } else if (duration === "This Week") {
          matches &&= diffDays <= 7 && diffMs > 0;
        }
      }
      return matches;
    }) ?? [];

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Most Popular":
          return (b.views || 0) - (a.views || 0);
        case "Price: Low to High":
          // Note: Add price field to ads table if needed
          return 0;
        // Placeholder until price field is added
        case "Price: High to Low":
          // Note: Add price field to ads table if needed
          return 0;
        // Placeholder until price field is added
        case "Newest First":
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });
    return filtered;
  })();
  return <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Live Advertisements
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing products and services from businesses in your area
          </p>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <Button onClick={() => setIsFiltersOpen(true)} variant="outline" className="flex items-center gap-2 glass-button border-white/30 text-gray-700 hover:text-gray-900">
            <Filter className="w-4 h-4" />
            Filters 
          </Button>
          
          <div className="flex-1 max-w-lg">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search businesses, products, services..." className="w-full px-6 py-3 glass-button border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 placeholder-gray-500" />
          </div>
          
          <Link to="/create">
            <Button className="glass-button text-gray-800 hover:text-gray-900 px-6 py-3 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Create Ad
            </Button>
          </Link>
        </div>

        {/* Category Filter with Subcategories */}
        <div className="mb-8">
          <div className="glass-card p-6 border-white/30">
            <h2 className="text-xl font-semibold gradient-text mb-4 text-center">Browse by Category</h2>
            <CategoryFilter selectedCategory={filterCategory} onCategoryChange={setFilterCategory} />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <div className="flex justify-center items-center py-16">
            <div className="glass-card p-8 text-center border-white/30">
              <Loader2 className="w-10 h-10 animate-spin text-cyan-600 mx-auto mb-4" />
              <span className="text-gray-600 font-medium">Loading amazing ads for you...</span>
            </div>
          </div>}

        {/* Error State */}
        {error && <div className="glass-card p-8 text-center border-white/30">
            <div className="glass-button w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold gradient-text mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-4">Failed to load ads. Please try again.</p>
            <Button onClick={() => window.location.reload()} className="glass-button text-gray-800 hover:text-gray-900 border-white/30">
              Try Again
            </Button>
          </div>}

        {/* Empty State */}
        {!isLoading && !error && ads && ads.length === 0 && <div className="glass-card p-12 text-center border-white/30">
            <div className="glass-button w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
              <Plus className="w-12 h-12 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-4">
              No Live Ads Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Be the first to create an advertisement and reach potential customers in your area!
            </p>
            <Link to="/create">
              <Button className="glass-button text-gray-800 hover:text-gray-900 px-8 py-3 rounded-xl">
                Create First Ad
              </Button>
            </Link>
          </div>}

        {/* Ads Grid */}
        {!isLoading && !error && filteredAndSortedAds && filteredAndSortedAds.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedAds.map(ad => {
          const images = getAdImages(ad);
          const currentIndex = currentImageIndex[ad.id] || 0;
          const currentImage = images[currentIndex] || images[0];
          return <Link key={ad.id} to={`/ad/${ad.id}`} className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer block border-white/30 group hover:scale-105">
                  {/* ADS Label */}
                  <div className="text-center py-2 bg-gradient-to-r from-cyan-50 to-blue-50">
                    <span className="text-gray-500 font-medium text-xs uppercase tracking-wide">SPONSORED</span>
                  </div>
                  
                  {/* Image Box */}
                  <div className="relative mx-3 mb-3">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl overflow-hidden">
                      {currentImage ? <img src={currentImage} alt={ad.headline} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-zoom-in" onMouseEnter={() => setHoveredAdId(ad.id)} onMouseLeave={() => setHoveredAdId(null)} /> : <div className="text-center p-4">
                          <span className="text-gray-400 text-sm font-medium">📷</span>
                          <p className="text-gray-400 text-xs mt-1">No Image</p>
                        </div>}
                    </div>
                    
                    {/* Package Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getPackageColor(ad.package_type)} text-white text-xs px-2 py-1 rounded-full shadow-lg`}>
                        {ad.package_type}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="px-4 pb-4 space-y-3">
                    {/* Title */}
                    <h3 className="text-gray-800 font-semibold text-base leading-tight line-clamp-2 group-hover:text-cyan-700 transition-colors">
                      {ad.headline ? ad.headline.includes('|') ? ad.headline.split('|')[0].trim() : ad.headline.substring(0, 50) + (ad.headline.length > 50 ? '...' : '') : "Untitled"}
                    </h3>
                    
                    {/* Views and Business Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {ad.views || 0} views
                      </div>
                      <span>•</span>
                      <span className="font-medium">{ad.business_name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {ad.business_location}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {ad.headline && ad.headline.includes('|') ? ad.headline.split('|')[1]?.trim() || ad.headline.substring(0, 80) + '...' : `Premium product from trusted business`}
                    </p>
                    
                     {/* Price Display */}
                    {(ad as any).price && <div className="mt-2">
                        <p className="text-lg font-bold text-cyan-700">
                          {formatPrice((ad as any).price, (ad as any).currency || 'USD')}
                          {(ad as any).negotiable && <span className="text-sm text-gray-500 ml-1">(Negotiable)</span>}
                        </p>
                      </div>}
                    
                    {/* Action Button */}
                    <Button size="sm" className="w-full mt-3 glass-button text-gray-800 hover:text-gray-900 rounded-lg transition-all duration-200">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </Link>;
        })}
          </div>}

        {/* Load More - Only show if there are ads */}
        {!isLoading && !error && ads && ads.length > 0 && <div className="text-center mt-12">
            <Button className="glass-button text-gray-800 hover:text-gray-900 px-8 py-3 rounded-xl border-white/30 hover:bg-white/50">
              Load More Ads
            </Button>
          </div>}
      </div>

      {/* Filters Panel */}
      <FiltersPanel isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} location={location} packageType={packageType} category={category} status={status} duration={duration} sortBy={sortBy} onLocationChange={setLocation} onPackageTypeChange={setPackageType} onCategoryChange={setCategory} onStatusChange={setStatus} onDurationChange={setDuration} onSortByChange={setSortBy} />
    </div>;
};
export default LiveAds;