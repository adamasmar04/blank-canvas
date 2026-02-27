import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const logoUrl = "https://i.postimg.cc/gjg2KLQH/Som-Adz-Best-logo.png";

const Footer = () => {
  return (
    <footer className="w-full py-12 px-0 bg-gradient-to-r from-cyan-50 to-blue-50">
      <div className="w-full">
        <div className="glass-card border-white/20 mx-4 p-8 lg:mx-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Section - Logo + Brand + Description */}
            <div className="flex flex-col items-start text-left space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src={logoUrl} 
                  alt="SomAdz Logo" 
                  width={50}
                  height={50}
                  className="h-[50px] w-auto object-contain flex-shrink-0"
                />
                <span className="text-2xl font-bold gradient-text">
                  SomAdz
                </span>
              </div>
              
              <p className="text-gray-600 max-w-sm leading-relaxed text-sm">
                SomAdz is a modern advertising platform helping small businesses grow and reach new customers around the world.
              </p>
              
              <p className="text-gray-500 font-medium text-sm">
                Established in 2025
              </p>
            </div>

            {/* Center Section - Policy Links */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <Link 
                  to="/privacy" 
                  className="text-gray-600 hover:text-gray-800 transition-colors hover:underline"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms" 
                  className="text-gray-600 hover:text-gray-800 transition-colors hover:underline"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>

            {/* Right Section - Social Media */}
            <div className="flex flex-col items-end space-y-4">
              <div className="flex items-center space-x-4">
                <a 
                  href="https://tiktok.com/@somadz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="TikTok"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a 
                  href="https://facebook.com/somadz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://instagram.com/somadz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
          
          {/* Copyright Section - Bottom */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 SomAdz. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;