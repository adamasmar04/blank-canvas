import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { Home, Megaphone, User, HelpCircle, Menu, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuthBackend";
const logoUrl = "https://i.postimg.cc/gjg2KLQH/Som-Adz-Best-logo.png";
const Navigation = () => {
  const location = useLocation();
  const {
    isAuthenticated,
    isDesignerOrAbove
  } = useAuth();
  const navItems = [{
    path: "/",
    label: "Home",
    icon: Home
  }, {
    path: "/ads",
    label: "Live Ads",
    icon: Megaphone
  }, {
    path: "/faq",
    label: "FAQ",
    icon: HelpCircle
  }, {
    path: "/admin",
    label: "Admin",
    icon: Settings,
    protected: true,
    adminOnly: true
  }];
  return <nav className="glass-nav sticky top-0 z-50 px-4 py-3 bg-cyan-100">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Brand - Left Aligned */}
        <Link to="/" className="flex items-center gap-4">
          <img src={logoUrl} alt="SomAdz Logo" width={50} height={50} className="h-[50px] w-auto object-contain flex-shrink-0" />
          <span className="text-2xl font-bold gradient-text hidden sm:block">
            SomAdz
          </span>
        </Link>
        
        {/* Desktop Navigation - Center */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.filter(item => {
            if (item.protected && !isAuthenticated) return false;
            if (item.adminOnly && !isDesignerOrAbove()) return false;
            return true;
          }).map(item => (
            <Link key={item.path} to={item.path}>
              <Button 
                variant={location.pathname === item.path ? "default" : "ghost"} 
                className={`px-6 py-2 ${location.pathname === item.path ? "glass-button text-gray-800" : "glass-button text-gray-700 hover:text-gray-900"}`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="glass-button text-gray-700 hover:text-gray-900 p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.filter(item => {
                    if (item.protected && !isAuthenticated) return false;
                    if (item.adminOnly && !isDesignerOrAbove()) return false;
                    return true;
                  }).map(item => (
                    <Link key={item.path} to={item.path}>
                      <Button 
                        variant={location.pathname === item.path ? "default" : "ghost"} 
                        className={`w-full justify-start text-left ${location.pathname === item.path ? "bg-primary text-primary-foreground" : ""}`}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Auth Button */}
          {isAuthenticated ? (
            <Link to="/profile">
              <Button size="sm" variant="ghost" className="glass-button text-gray-700 hover:text-gray-900 p-2">
                <User className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button className="glass-button text-slate-950 bg-slate-100 px-4 py-2">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>;
};
export default Navigation;