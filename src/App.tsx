
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuthBackend";
import Index from "./pages/Index";
import LiveAds from "./pages/LiveAds";
import CreateAd from "./pages/CreateAd";
import AdDetails from "./pages/AdDetails";

import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import ChatSupport from "./components/ChatSupport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route 
            path="/ads" 
            element={<LiveAds />} 
          />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <CreateAd />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ad/:id" 
            element={
              <ProtectedRoute>
                <AdDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <AdminProtectedRoute requiredRole="admin">
                <Admin />
              </AdminProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatSupport />
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
