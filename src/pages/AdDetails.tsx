import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Globe, MapPin, Eye, Clock, Heart, Share2, MessageCircle, User, Star, Truck, Shield, CheckCircle, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MediaCarousel from "@/components/MediaCarousel";
import { Instagram, Facebook } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ReportAdForm from "@/components/ReportAdForm";
import { formatPrice } from "@/lib/currency";

export default function AdDetails() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const { id } = useParams();

  // Fetch ad data from Supabase
  const { data: ad, isLoading, error } = useQuery({
    queryKey: ['ad', id],
    queryFn: async () => {
      if (!id) throw new Error('Ad ID is required');
      
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Ad not found');
      
      // Increment view counter
      try {
        await supabase
          .from('ads')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);
      } catch (viewError) {
        console.error('Error updating view count:', viewError);
      }
      
      return data;
    },
    enabled: !!id
  });

  // Fetch related ads
  const { data: relatedAds } = useQuery({
    queryKey: ['related-ads', (ad as any)?.industry, ad?.id],
    queryFn: async () => {
      if (!ad) return [];
      
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .neq('id', ad.id)
        .or(`industry.eq.${(ad as any).industry || 'unknown'},tags.ilike.%${ad.tags || 'general'}%`)
        .limit(4);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!ad
  });

  // Helper functions
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
    if (!ad?.social_media) return {};
    try {
      return typeof ad.social_media === 'string' ? JSON.parse(ad.social_media) : ad.social_media;
    } catch {
      return {};
    }
  };

  const getTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} left`;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading ad details...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !ad) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-4">Ad Not Found</h1>
            <p className="text-muted-foreground mb-6">The ad you're looking for doesn't exist or has been removed.</p>
            <Link to="/ads">
              <Button>← Back to Live Ads</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = getAdImages(ad);
  const socialMedia = getSocialMediaLinks(ad);
  const timeLeft = getTimeLeft(ad.expires_at);

  const handleCall = () => {
    window.location.href = `tel:${ad.business_number}`;
  };

  const handleMessage = () => {
    // Open SMS app with seller's number
    if (ad?.business_number) {
      const message = encodeURIComponent(`Hi, I'm interested in your ad: ${ad.headline}`);
      window.location.href = `sms:${ad.business_number}?body=${message}`;
    } else {
      toast({
        title: "Phone number not available",
        description: "Unable to send SMS - no phone number provided",
        variant: "destructive"
      });
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this ${ad.headline}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`);
        break;
      default:
        navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "Ad link copied to clipboard"
        });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/ads" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Live Ads
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-card rounded-lg overflow-hidden border">
              {images.length > 0 ? (
                <img 
                  src={images[selectedImage]} 
                  alt={ad.headline}
                  className="w-full h-full object-cover cursor-zoom-in hover:scale-110 transition-transform duration-300"
                  onClick={() => {
                    // Open image in new tab instead of popup
                    window.open(images[selectedImage], '_blank');
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No Image Available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-primary' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${ad.headline} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Information */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              {/* Title */}
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {ad.headline && ad.headline.includes('|') 
                  ? ad.headline.split('|')[0].trim() 
                  : ad.headline}
              </h1>
              
              {/* Description */}
              {ad.headline && ad.headline.includes('|') && (
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  {ad.headline.split('|')[1]?.trim()}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {ad.views || 0} views
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {timeLeft}
                </div>
                <Badge variant="secondary">{ad.package_type}</Badge>
              </div>
              
              {/* Price with correct currency */}
              {(ad as any).price && (
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatPrice((ad as any).price, (ad as any).currency || 'USD')}
                  {(ad as any).negotiable && <span className="text-lg text-muted-foreground ml-2">(Negotiable)</span>}
                </div>
              )}
              {/* Seller Profile */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{ad.business_name}</h3>
                  <p className="text-sm text-muted-foreground">Verified Seller</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Product Details:</h3>
              <div className="space-y-2 text-foreground leading-relaxed">
                {(ad as any).industry && (
                  <p><span className="font-medium">Industry:</span> {(ad as any).industry}</p>
                )}
                {(ad as any).subcategory && (
                  <p><span className="font-medium">Category:</span> {(ad as any).subcategory}</p>
                )}
                {(ad as any).campaign_objective && (
                  <p><span className="font-medium">Type:</span> {(ad as any).campaign_objective}</p>
                )}
              </div>
            </div>

            {/* Categories and Tags */}
            {(ad.tags || ad.hashtags) && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Categories:</h3>
                <div className="flex flex-wrap gap-2">
                  {ad.hashtags && ad.hashtags.split(" ").map((tag, index) => (
                    <Badge key={`hashtag-${index}`} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {ad.tags && ad.tags.split(",").map((tag, index) => (
                    <Badge key={`tag-${index}`} variant="outline">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Business Location */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Location</h3>
              </div>
              <p className="text-muted-foreground">{ad.business_location}</p>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleCall}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
              
              <Button 
                onClick={handleMessage}
                variant="outline" 
                className="w-full"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send SMS to Seller
              </Button>
            </div>

            {/* Social Media Sharing */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-foreground mb-3">Share this Ad:</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleShare('facebook')}
                  className="flex-1"
                >
                  <Facebook className="w-4 h-4 mr-1" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleShare('whatsapp')}
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleShare('telegram')}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Telegram
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleShare('email')}
                  className="flex-1"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Area - Seller Information */}
        <div className="mt-12 border-t pt-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Seller Info */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{ad.business_name}</h3>
                  <p className="text-sm text-muted-foreground">Verified Seller</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{ad.business_location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-foreground">4.8 Rating (127 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-foreground">Trusted Seller</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View More from this Seller
              </Button>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{ad.business_number}</span>
                </div>
                {socialMedia.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={socialMedia.website.startsWith('http') ? socialMedia.website : `https://${socialMedia.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                {socialMedia.instagram && (
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={socialMedia.instagram.startsWith('http') ? socialMedia.instagram : `https://${socialMedia.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Follow on Instagram
                    </a>
                  </div>
                )}
                {socialMedia.facebook && (
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={socialMedia.facebook.startsWith('http') ? socialMedia.facebook : `https://${socialMedia.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Facebook Page
                    </a>
                  </div>
                )}
                {socialMedia.tiktok && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={socialMedia.tiktok.startsWith('http') ? socialMedia.tiktok : `https://${socialMedia.tiktok}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit TikTok
                    </a>
                  </div>
                )}
                {socialMedia.productLink && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={socialMedia.productLink.startsWith('http') ? socialMedia.productLink : `https://${socialMedia.productLink}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      View Original Product
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Safety Tips */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Meet in public places</li>
                <li>• Don't pay in advance</li>
                <li>• Verify seller credentials</li>
                <li>• Report suspicious activity</li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setIsReportFormOpen(true)}
              >
                Report this Ad
              </Button>
            </Card>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedAds && relatedAds.length > 0 ? (
              relatedAds.map((relatedAd) => {
                const relatedImages = getAdImages(relatedAd);
                return (
                  <Link key={relatedAd.id} to={`/ad/${relatedAd.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        {relatedImages[0] ? (
                          <img 
                            src={relatedImages[0]} 
                            alt={relatedAd.headline}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-muted-foreground">No Image</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {relatedAd.headline}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {relatedAd.business_name}
                        </p>
                        {(relatedAd as any).price && (
                          <p className="text-lg font-bold text-primary mb-2">
                            {formatPrice((relatedAd as any).price, (relatedAd as any).currency || 'USD')}
                          </p>
                        )}
                        <Button size="sm" className="w-full">View Details</Button>
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No related products found</p>
              </div>
            )}
          </div>
        </div>

        {/* Report Form Modal */}
        <ReportAdForm
          isOpen={isReportFormOpen}
          onClose={() => setIsReportFormOpen(false)}
          adId={ad.id}
          adTitle={ad.headline}
        />
      </div>
    </div>
  );
}
