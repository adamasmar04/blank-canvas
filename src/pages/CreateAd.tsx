import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check, Upload, MapPin, Users, Zap, ChevronDown, Loader2, Link as LinkIcon } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { useAdCreation, AdFormData } from "@/hooks/useAdCreation";
import { IndustrySelector } from "@/components/IndustrySelector";
import { CampaignObjectiveSelector } from "@/components/CampaignObjectiveSelector";
import { TargetLocationSelector } from "@/components/TargetLocationSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { supabase } from "@/integrations/supabase/client";
import AdEditor from "./AdEditor";

const CreateAd = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [fetchingImage, setFetchingImage] = useState(false);
  const [fetchedImageData, setFetchedImageData] = useState<{image?: string, title?: string, description?: string} | null>(null);
  const [adType, setAdType] = useState<"business" | "affiliate">("business");
  const [formData, setFormData] = useState<AdFormData>({
    businessName: "",
    businessNumber: "",
    targetLocation: "",
    businessLocation: "",
    targetAgeMin: 18,
    targetAgeMax: 65,
    socialMedia: {
      tiktok: "",
      facebook: "",
      instagram: "",
      website: ""
    },
    title: "",
    description: "",
    category: "",
    industry: "",
    subcategory: "",
    campaignObjective: "awareness",
    price: null,
    negotiable: false,
    keyFeatures: "",
    package: "",
    images: [],
    currency: "USD",
    hashtags: "",
    tags: "",
    productLink: "",
    websiteLink: ""
  });

  const { createAd, isSubmitting } = useAdCreation();
  const navigate = useNavigate();

  // Auto-fetch image when product link changes
  const handleProductLinkChange = async (url: string) => {
    setFormData(prev => ({ ...prev, productLink: url }));
    
    if (url && adType === "affiliate" && url.startsWith('http')) {
      setFetchingImage(true);
      try {
        console.log('Calling edge function to fetch product image for:', url);
        
        const { data, error } = await supabase.functions.invoke('fetch-product-image', {
          body: { url }
        });

        if (error) {
          console.error('Edge function error:', error);
          toast({
            title: "Warning",
            description: "Could not fetch product image automatically. You can upload one manually.",
            variant: "destructive",
          });
          return;
        }

        if (data?.success && data.image) {
          console.log('Successfully fetched product data:', data);
          setFetchedImageData({
            image: data.image,
            title: data.title,
            description: data.description
          });

          // Auto-fill title and description if they're empty
          setFormData(prev => ({
            ...prev,
            title: prev.title || data.title || '',
            description: prev.description || data.description || ''
          }));

          toast({
            title: "Success",
            description: "Product image and details fetched automatically!",
          });
        } else {
          console.log('No image found or fetch failed:', data);
          toast({
            title: "Notice",
            description: "Could not find product image. Please upload one manually.",
          });
        }
      } catch (error) {
        console.error('Error fetching product image:', error);
        toast({
          title: "Error",
          description: "Failed to fetch product details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setFetchingImage(false);
      }
    }
  };

  const packages = [
    {
      name: "Basic",
      duration: "1 Day",
      price: "$3.00",
      color: "bg-green-500",
      features: ["1 image design", "Basic analytics", "Social media marketing", "Basic support"]
    },
    {
      name: "Standard",
      duration: "3 Days",
      price: "$9.50",
      color: "bg-yellow-500",
      features: ["3 image designs", "Enhanced analytics", "Social media marketing", "Email Marketing", "Featured ad placement"]
    },
    {
      name: "Premium",
      duration: "7 Days",
      price: "$21.99",
      color: "bg-blue-500",
      features: ["5 image designs", "Comprehensive analytics", "Social media sharing", "Email Marketing", "Premium ad placement", "Priority support"]
    }
  ];

  const handleNext = () => {
    // Validate required fields for each step
    if (currentStep === 1) {
      if (adType === "business") {
        if (!formData.businessName || !formData.businessNumber || !formData.targetLocation || !formData.businessLocation || !formData.title || !formData.description || !formData.industry || !formData.subcategory || !formData.campaignObjective) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields before continuing.",
            variant: "destructive"
          });
          return;
        }
      } else {
        // Affiliate validation
        if (!formData.title || !formData.description || !formData.businessNumber || !formData.targetLocation || !formData.price || !formData.productLink) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields before continuing.",
            variant: "destructive"
          });
          return;
        }
      }
    }
    if (currentStep === 2 && !formData.package) {
      toast({
        title: "Package Required",
        description: "Please select a package before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    // Business flow: Info → Plans → Media → Editor → Payment → Confirm (6 steps)
    // Affiliate flow: Info → Plans → Editor → Payment → Confirm (5 steps) 
    const maxSteps = adType === "business" ? 6 : 5;
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Final validation based on ad type
    if (adType === "business") {
      if (!formData.businessName || !formData.businessNumber || !formData.targetLocation || !formData.businessLocation || !formData.title || !formData.description || !formData.industry || !formData.subcategory || !formData.campaignObjective || !formData.package) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Affiliate validation
      if (!formData.title || !formData.description || !formData.businessNumber || !formData.targetLocation || !formData.price || !formData.productLink || !formData.package) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
    }
    
    const success = await createAd({
      ...formData,
      adType,
      productImageUrl: adType === "affiliate" && fetchedImageData?.image ? fetchedImageData.image : undefined
    });
    if (success) {
      setTimeout(() => {
        navigate("/ads");
      }, 2000);
    }
  };

  const updateFormData = (field: keyof AdFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSocialMedia = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        if (adType === "affiliate") {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="glass-button w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-cyan-700" />
                </div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Affiliate Information</h2>
                <p className="text-gray-600">Tell us about the product you want to promote</p>
              </div>

              {/* Target Audience Location */}
              <TargetLocationSelector 
                selectedLocation={formData.targetLocation} 
                onLocationChange={value => updateFormData("targetLocation", value)} 
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={e => updateFormData("title", e.target.value)} 
                    className="glass-button border-white/30" 
                    placeholder="Enter product title" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessNumber">Phone Number *</Label>
                  <Input 
                    id="businessNumber" 
                    value={formData.businessNumber} 
                    onChange={e => updateFormData("businessNumber", e.target.value)} 
                    className="glass-button border-white/30" 
                    placeholder="Enter your phone number" 
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Target Audience Age Range</Label>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Age: {formData.targetAgeMin} - {formData.targetAgeMax} years</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Minimum Age</Label>
                      <input 
                        type="range" 
                        min="1" 
                        max="65" 
                        value={formData.targetAgeMin} 
                        onChange={e => updateFormData("targetAgeMin", parseInt(e.target.value))} 
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Maximum Age</Label>
                      <input 
                        type="range" 
                        min="1" 
                        max="65" 
                        value={formData.targetAgeMax} 
                        onChange={e => updateFormData("targetAgeMax", parseInt(e.target.value))} 
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Product Price *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={formData.price || ""} 
                    onChange={e => updateFormData("price", e.target.value ? parseFloat(e.target.value) : null)} 
                    className="glass-button border-white/30" 
                    placeholder="Enter price" 
                    min="0" 
                    step="0.01" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <CurrencySelector 
                    selectedCurrency={formData.currency} 
                    onCurrencyChange={value => updateFormData("currency", value)} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="productLink">Product Link *</Label>
                  <div className="relative">
                    <Input
                      id="productLink"
                      type="url"
                      placeholder="https://amazon.com/product-link or https://shopify.com/product"
                      value={formData.productLink}
                      onChange={(e) => handleProductLinkChange(e.target.value)}
                      required
                      className="pl-10"
                    />
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {fetchingImage && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Paste your product link from Amazon, Shopify, Alibaba, etc. We'll automatically fetch the product image and details.
                  </p>
                </div>

                {/* Show fetched image preview */}
                {fetchedImageData?.image && (
                  <div className="space-y-2">
                    <Label>Fetched Product Image</Label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <img 
                        src={fetchedImageData.image} 
                        alt="Fetched product" 
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Failed to load fetched image');
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        ✅ Product image fetched successfully from your link
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteLink">Website Link</Label>
                <Input 
                  id="websiteLink" 
                  value={formData.websiteLink || ""} 
                  onChange={e => updateFormData("websiteLink", e.target.value)} 
                  className="glass-button border-white/30" 
                  placeholder="Enter your website URL (optional)" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description *</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={e => updateFormData("description", e.target.value)} 
                  className="glass-button border-white/30 min-h-[120px]" 
                  placeholder="Write a detailed description of the product..." 
                  required 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input 
                    id="tags" 
                    value={formData.tags} 
                    onChange={e => updateFormData("tags", e.target.value)} 
                    className="glass-button border-white/30" 
                    placeholder="e.g., electronics, gadgets, tech" 
                  />
                  <p className="text-sm text-gray-500">Add relevant keywords separated by commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Input 
                    id="hashtags" 
                    value={formData.hashtags} 
                    onChange={e => updateFormData("hashtags", e.target.value)} 
                    className="glass-button border-white/30" 
                    placeholder="#affiliate #deals #shopping" 
                  />
                  <p className="text-sm text-gray-500">Add hashtags for better visibility</p>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="glass-button w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-cyan-700" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Business Information</h2>
              <p className="text-gray-600">Tell us about your business and target audience</p>
            </div>

            {/* Industry and Subcategory Selection */}
            <IndustrySelector 
              industry={formData.industry} 
              subcategory={formData.subcategory} 
              onIndustryChange={value => updateFormData("industry", value)} 
              onSubcategoryChange={value => updateFormData("subcategory", value)} 
            />

            {/* Campaign Objective Selection */}
            <CampaignObjectiveSelector 
              campaignObjective={formData.campaignObjective} 
              onCampaignObjectiveChange={value => updateFormData("campaignObjective", value)} 
            />

            {/* Target Audience Location with Map */}
            <TargetLocationSelector 
              selectedLocation={formData.targetLocation} 
              onLocationChange={value => updateFormData("targetLocation", value)} 
            />

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input 
                  id="businessName" 
                  value={formData.businessName} 
                  onChange={e => updateFormData("businessName", e.target.value)} 
                  className="glass-button border-white/30" 
                  placeholder="Enter your business name" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessNumber">Business Number *</Label>
                <Input 
                  id="businessNumber" 
                  value={formData.businessNumber} 
                  onChange={e => updateFormData("businessNumber", e.target.value)} 
                  className="glass-button border-white/30" 
                  placeholder="Enter your contact number" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessLocation">Business Location *</Label>
                <Input 
                  id="businessLocation" 
                  value={formData.businessLocation} 
                  onChange={e => updateFormData("businessLocation", e.target.value)} 
                  className="glass-button border-white/30" 
                  placeholder="Enter your business location" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Target Audience Age Range</Label>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Age: {formData.targetAgeMin} - {formData.targetAgeMax} years</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Minimum Age</Label>
                    <input 
                      type="range" 
                      min="1" 
                      max="65" 
                      value={formData.targetAgeMin} 
                      onChange={e => updateFormData("targetAgeMin", parseInt(e.target.value))} 
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Maximum Age</Label>
                    <input 
                      type="range" 
                      min="1" 
                      max="65" 
                      value={formData.targetAgeMax} 
                      onChange={e => updateFormData("targetAgeMax", parseInt(e.target.value))} 
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Ad Title *</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => updateFormData("title", e.target.value)} 
                  className="glass-button border-white/30" 
                  placeholder="Enter a clear, specific title (max 80 characters)" 
                  maxLength={80} 
                  required 
                />
                <p className="text-sm text-gray-500">{formData.title.length}/80 characters</p>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={formData.price || ""} 
                    onChange={e => updateFormData("price", e.target.value ? parseFloat(e.target.value) : null)} 
                    className="glass-button border-white/30" 
                    placeholder="Enter price" 
                    min="0" 
                    step="0.01" 
                  />
                </div>
                <div className="space-y-2">
                  <CurrencySelector 
                    selectedCurrency={formData.currency} 
                    onCurrencyChange={value => updateFormData("currency", value)} 
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-2 glass-card p-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.negotiable} 
                      onChange={e => updateFormData("negotiable", e.target.checked)} 
                      className="rounded" 
                    />
                    <span className="text-sm">Negotiable</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyFeatures">Key Features</Label>
                <Textarea 
                  id="keyFeatures" 
                  value={formData.keyFeatures} 
                  onChange={e => updateFormData("keyFeatures", e.target.value)} 
                  className="glass-button border-white/30" 
                  placeholder="• 100% Organic Cotton&#10;• Available in All Sizes&#10;• Free Delivery in Hargeisa" 
                  rows={4} 
                />
                <p className="text-sm text-gray-500">List the main selling points, one per line</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={e => updateFormData("description", e.target.value)} 
                  className="glass-button border-white/30 min-h-[120px]" 
                  placeholder="Write a detailed description of your product or service..." 
                  required 
                />
                <p className="text-sm text-gray-500">Provide comprehensive details about your offering</p>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Social Media Links</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  placeholder="TikTok Profile URL" 
                  value={formData.socialMedia.tiktok} 
                  onChange={e => updateSocialMedia("tiktok", e.target.value)} 
                  className="glass-button border-white/30" 
                />
                <Input 
                  placeholder="Facebook Profile URL" 
                  value={formData.socialMedia.facebook} 
                  onChange={e => updateSocialMedia("facebook", e.target.value)} 
                  className="glass-button border-white/30" 
                />
                <Input 
                  placeholder="Instagram Profile URL" 
                  value={formData.socialMedia.instagram} 
                  onChange={e => updateSocialMedia("instagram", e.target.value)} 
                  className="glass-button border-white/30" 
                />
                <Input 
                  placeholder="Website URL" 
                  value={formData.socialMedia.website} 
                  onChange={e => updateSocialMedia("website", e.target.value)} 
                  className="glass-button border-white/30" 
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="glass-button w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-cyan-700" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Choose Your Plan</h2>
              <p className="text-gray-600">Select the advertising package that best fits your needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <Card 
                  key={index} 
                  className={`glass-card border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 ${formData.package === pkg.name ? 'ring-2 ring-cyan-500' : ''}`} 
                  onClick={() => updateFormData("package", pkg.name)}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${pkg.color}`}></div>
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Badge className={`${pkg.color} text-white px-4 py-2 rounded-full`}>
                        {pkg.name}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl font-bold gradient-text mb-2">
                      {pkg.price}
                    </CardTitle>
                    <p className="text-lg font-medium text-gray-600">
                      {pkg.duration}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}
                    {formData.package === pkg.name && (
                      <div className="pt-4">
                        <Badge className="w-full justify-center bg-cyan-500 text-white py-2">
                          Selected
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        // Business: Media Upload step / Affiliate: Skip to Editor
        if (adType === "business") {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="glass-button w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-cyan-700" />
                </div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Upload Media</h2>
                <p className="text-gray-600">Upload images or videos for your ad</p>
              </div>

              <FileUpload 
                onFileSelect={(files) => updateFormData("images", files)} 
                selectedFiles={formData.images}
                maxFiles={parseInt(formData.package === "Basic" ? "1" : formData.package === "Standard" ? "3" : "5")}
              />
            </div>
          );
        } else {
          // Affiliate goes directly to Editor
          return (
            <AdEditor
              formData={formData}
              onBack={handleBack}
              onNext={handleNext}
              onSkip={handleNext}
              updateFormData={updateFormData}
            />
          );
        }

      case 4:
        if (adType === "business") {
          // Business: Editor step
          return (
            <AdEditor
              formData={formData}
              onBack={handleBack}
              onNext={handleNext}
              onSkip={handleNext}
              updateFormData={updateFormData}
            />
          );
        } else {
          // Affiliate: Payment step
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-2">Payment</h2>
                <p className="text-gray-600">Complete your payment to publish your ad</p>
              </div>
              <p className="text-center text-gray-600">Payment integration coming soon...</p>
            </div>
          );
        }

      case 5:
        if (adType === "business") {
          // Business: Payment step
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-2">Payment</h2>
                <p className="text-gray-600">Complete your payment to publish your ad</p>
              </div>
              <p className="text-center text-gray-600">Payment integration coming soon...</p>
            </div>
          );
        } else {
          // Affiliate: Confirm step
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-2">Confirm & Publish</h2>
                <p className="text-gray-600">Review your ad before publishing</p>
              </div>
              <p className="text-center text-gray-600">Ad confirmation details...</p>
            </div>
          );
        }

      case 6:
        // Business: Confirm step
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">Confirm & Publish</h2>
              <p className="text-gray-600">Review your ad before publishing</p>
            </div>
            <p className="text-center text-gray-600">Ad confirmation details...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold gradient-text">Create Your Ad</h1>
            <div className="flex items-center gap-4">
              {/* Ad Type Selector */}
              <Select value={adType} onValueChange={(value: "business" | "affiliate") => {
                setAdType(value);
                setCurrentStep(1);
                setFetchedImageData(null);
                // Reset form data when switching types
                setFormData({
                  businessName: "",
                  businessNumber: "",
                  targetLocation: "",
                  businessLocation: "",
                  targetAgeMin: 18,
                  targetAgeMax: 65,
                  socialMedia: { tiktok: "", facebook: "", instagram: "", website: "" },
                  title: "",
                  description: "",
                  category: "",
                  industry: "",
                  subcategory: "",
                  campaignObjective: "awareness",
                  price: null,
                  negotiable: false,
                  keyFeatures: "",
                  package: "",
                  images: [],
                  currency: "USD",
                  hashtags: "",
                  tags: "",
                  productLink: "",
                  websiteLink: ""
                });
              }}>
                <SelectTrigger className="w-48 glass-button border-white/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="business">Business Info</SelectItem>
                  <SelectItem value="affiliate">Affiliate Marketing</SelectItem>
                </SelectContent>
              </Select>
              
              <Progress value={(currentStep / (adType === "business" ? 6 : 5)) * 100} className="w-32" />
              <span className="text-sm text-gray-600">
                Step {currentStep} of {adType === "business" ? 6 : 5}
              </span>
            </div>
          </div>

          {/* Step Content */}
          {(currentStep === 3 && adType === "affiliate") || (currentStep === 4 && adType === "business") ? (
            // Render AdEditor without Card wrapper for full canvas experience
            renderStep()
          ) : (
            <Card className="glass-card border-white/20 mb-8">
              <CardContent className="p-8">
                {renderStep()}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          {!((currentStep === 3 && adType === "affiliate") || (currentStep === 4 && adType === "business")) && (
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={currentStep === 1} 
                className="glass-button border-white/30 text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < (adType === "business" ? 6 : 5) && (
                <Button onClick={handleNext} className="bg-cyan-500 hover:bg-cyan-600 text-white px-8">
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
              {currentStep === (adType === "business" ? 6 : 5) && (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                >
                  {isSubmitting ? "Publishing..." : "Publish Ad"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAd;
