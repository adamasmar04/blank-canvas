
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface AdFormData {
  businessName: string;
  businessNumber: string;
  targetLocation: string;
  businessLocation: string;
  targetAgeMin: number;
  targetAgeMax: number;
  socialMedia: {
    tiktok: string;
    facebook: string;
    instagram: string;
    website: string;
  };
  title: string;
  description: string;
  category: string;
  industry: string;
  subcategory: string;
  campaignObjective: string;
  price: number | null;
  negotiable: boolean;
  keyFeatures: string;
  package: string;
  images: File[];
  currency: string;
  hashtags: string;
  tags: string;
  productLink?: string;
  websiteLink?: string;
  adType?: "business" | "affiliate";
  productImageUrl?: string;
}

export const useAdCreation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadMedia = async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log('Uploading file to Supabase storage:', filePath);
      
      const { data, error } = await supabase.storage
        .from('ad-media')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ad-media')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully, public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      return null;
    }
  };

  const calculateExpiryDate = (packageType: string): string => {
    const now = new Date();
    switch (packageType.toLowerCase()) {
      case 'basic':
        now.setDate(now.getDate() + 1);
        break;
      case 'standard':
        now.setDate(now.getDate() + 3);
        break;
      case 'premium':
        now.setDate(now.getDate() + 7);
        break;
      default:
        now.setDate(now.getDate() + 1);
    }
    return now.toISOString();
  };

  const createAd = async (formData: AdFormData & { adType?: "business" | "affiliate"; productImageUrl?: string }): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create an ad.",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting ad creation process...');
      
      let mediaUrls: string[] = [];
      
      // Upload media files if provided (only for business ads)
      if (formData.adType !== "affiliate" && formData.images && formData.images.length > 0) {
        console.log('Uploading media files...');
        for (const image of formData.images) {
          const imageUrl = await uploadMedia(image, user.id);
          if (imageUrl) {
            mediaUrls.push(imageUrl);
          } else {
            toast({
              title: "Upload Failed",
              description: "Failed to upload one or more media files. Please try again.",
              variant: "destructive",
            });
            return false;
          }
        }
      }
      
      // For affiliate ads, use the fetched product image if available
      if (formData.adType === "affiliate" && formData.productImageUrl) {
        mediaUrls.push(formData.productImageUrl);
      }

      // Prepare ad data for database
      const adId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const adData = {
        id: adId,
        user_id: user.id,
        business_name: formData.adType === "affiliate" ? "Affiliate" : formData.businessName,
        business_number: formData.businessNumber,
        business_location: formData.adType === "affiliate" ? "Online" : formData.businessLocation,
        target_location: formData.targetLocation,
        target_age_min: formData.targetAgeMin,
        target_age_max: formData.targetAgeMax,
        social_media: formData.adType === "affiliate" ? 
          { ...formData.socialMedia, website: formData.websiteLink || formData.socialMedia.website, productLink: formData.productLink } : 
          formData.socialMedia,
        headline: `${formData.title} | ${formData.description}`,
        industry: formData.adType === "affiliate" ? "Affiliate Marketing" : formData.industry,
        subcategory: formData.adType === "affiliate" ? "Product Promotion" : formData.subcategory,
        campaign_objective: formData.adType === "affiliate" ? "conversions" : formData.campaignObjective,
        package_type: formData.package,
        image_url: mediaUrls.length > 0 ? mediaUrls[0] : null,
        media_urls: mediaUrls,
        currency: formData.currency || 'USD',
        hashtags: formData.hashtags,
        tags: formData.tags,
        status: 'active',
        expires_at: calculateExpiryDate(formData.package),
        views: 0,
        price: formData.price
      };

      console.log('Inserting ad into database:', adData);

      // Insert ad into database
      const { data, error } = await supabase
        .from('ads')
        .insert([adData])
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Ad created successfully:', data);

      toast({
        title: "🎉 Congratulations!",
        description: "Your ad is now live and will appear on the Live Ads page!",
      });

      return true;
    } catch (error) {
      console.error('Error creating ad:', error);
      const message = (error as any)?.message || 'Failed to create ad. Please try again.';
      toast({
        title: "Creation Failed",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createAd,
    isSubmitting
  };
};
