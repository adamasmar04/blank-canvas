import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, TrendingUp, Globe, BarChart3, Check, Zap, Target, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  const packages = [{
    name: "Basic",
    duration: "1 Day",
    price: "$3.00",
    color: "bg-green-500",
    features: ["1 image or video upload", "Basic analytics", "Social media marketing (Facebook, Instagram, TikTok)", "Basic support"],
    bestFor: "Urgent or one-day ads"
  }, {
    name: "Standard",
    duration: "3 Days",
    price: "$9.50",
    color: "bg-yellow-500",
    features: ["3 image or video uploads", "Enhanced analytics", "Social media marketing (Facebook, Instagram, TikTok)", "Email Marketing", "Featured ad placement"],
    bestFor: "Short campaigns with solid exposure"
  }, {
    name: "Premium",
    duration: "7 Days",
    price: "$21.99",
    color: "bg-blue-500",
    features: ["5 image or video uploads", "Comprehensive analytics", "Social media sharing", "Email Marketing", "Premium ad placement", "Priority support"],
    bestFor: "Maximum visibility for a full week"
  }];
  const features = [{
    icon: Users,
    title: "Reach New Customers",
    description: "We help your ads reach a wider audience, regardless of their location."
  }, {
    icon: TrendingUp,
    title: "Increase Your Sales",
    description: "By boosting the visibility of your products, you'll see a significant increase in sales."
  }, {
    icon: Globe,
    title: "Modern Advertising",
    description: "We offer contemporary advertising tools and services suitable for social media and the internet."
  }, {
    icon: BarChart3,
    title: "Manage Your Ads",
    description: "Easily monitor the performance and views of your advertisements."
  }];
  const steps = [{
    number: "01",
    title: "Your Business Info",
    description: "Start by entering your business details and target audience."
  }, {
    number: "02",
    title: "Choose a Plan",
    description: "Select the advertising package that best fits your needs."
  }, {
    number: "03",
    title: "Upload Your Ad",
    description: "Upload the images or videos you want to advertise."
  }, {
    number: "04",
    title: "Confirm & Publish",
    description: "Review your ad and publish it."
  }];
  return <div className="min-h-screen">
      <Navigation />
      

      {/* Hero Section (Keep for overlays, badges, quick-CTA etc. if desired) */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="glass-card max-w-4xl mx-auto p-8 mb-8">
            <Badge className="glass-button mb-4 text-cyan-700 border-cyan-200">
              <Zap className="w-4 h-4 mr-2" />
              Modern Advertising Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
              SomAdz
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Help small businesses reach new customers and expand their sales beyond their local area with our modern advertising solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create">
                <Button size="lg" className="glass-button px-8 py-4 text-lg rounded-2xl text-zinc-950 bg-zinc-100">
                  Create Your Ad
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/ads">
                <Button variant="outline" size="lg" className="glass-button border-white/30 px-8 py-4 text-lg rounded-2xl text-zinc-950 bg-zinc-50">
                  View Live Ads
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              What SomAdz Does
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SomAdz makes it easy for you to grow your business with modern advertising solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <Card key={index} className="glass-card border-white/20 hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="glass-button w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-cyan-700" />
                  </div>
                  <CardTitle className="gradient-text text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Pricing & Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect package for your advertising needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => <Card key={index} className="glass-card border-white/20 hover:scale-105 transition-all duration-300 relative overflow-hidden">
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
                  <CardDescription className="text-lg font-medium text-gray-600">
                    {pkg.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {pkg.features.map((feature, idx) => <div key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>)}
                  </div>
                  
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm font-medium text-gray-700">Best For:</span>
                    </div>
                    <p className="text-gray-600 text-sm">{pkg.bestFor}</p>
                  </div>
                  
                  <Link to="/create" className="block pt-4">
                    <Button className="w-full glass-button rounded-xl text-gray-950 bg-gray-50">
                      Choose {pkg.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Placing an ad on SomAdz is simple. Just follow these easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => <div key={index} className="relative">
                <Card className="glass-card border-white/20 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader className="text-center">
                    <div className="glass-button w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold gradient-text">{step.number}</span>
                    </div>
                    <CardTitle className="gradient-text text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{step.description}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-cyan-600" />
                  </div>}
              </div>)}
          </div>

          <div className="text-center mt-12">
            <Link to="/create">
              <Button size="lg" className="glass-button text-gray-800 hover:text-gray-900 px-8 py-4 text-lg rounded-2xl">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="glass-card border-white/20 max-w-4xl mx-auto">
            <CardContent className="text-center p-12">
              <div className="flex justify-center mb-6">
                <div className="glass-button w-20 h-20 rounded-full flex items-center justify-center">
                  <Star className="w-10 h-10 text-yellow-500" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                Ready to Boost Your Business?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses already using SomAdz to reach new customers and increase their sales.
              </p>
              <Link to="/create">
                <Button size="lg" className="glass-button text-gray-800 hover:text-gray-900 px-8 py-4 text-lg rounded-2xl">
                  Create Your First Ad
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default Index;
