import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="glass-card border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold gradient-text mb-4">
                Privacy Policy
              </CardTitle>
              <p className="text-gray-600">
                Last updated: January 2025
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Information We Collect</h2>
                <p className="text-gray-600 leading-relaxed">
                  We collect information you provide directly to us, such as your name, email address, 
                  business name, location, phone number, and any content you upload to our platform. 
                  We also collect information about your device, browser, and how you interact with our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">How We Use Your Data</h2>
                <p className="text-gray-600 leading-relaxed">
                  We use your information to provide and improve our advertising services, communicate with you, 
                  provide customer support, analyze platform usage, and send marketing communications (with your consent). 
                  We also use data for security purposes and to comply with legal obligations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">How We Protect Your Data</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. This includes 
                  encryption, secure servers, and regular security assessments.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Do We Share Your Data With Others?</h2>
                <p className="text-gray-600 leading-relaxed">
                  We do not sell your personal information. We may share your data with trusted third-party 
                  service providers who help us operate our platform, but only with your consent and under 
                  strict confidentiality agreements. We may also share information when required by law.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Your Rights</h2>
                <p className="text-gray-600 leading-relaxed">
                  You have the right to access, update, or delete your personal information. You can also 
                  object to processing, request data portability, and withdraw consent where applicable. 
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Cookies</h2>
                <p className="text-gray-600 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze site traffic, 
                  and personalize content. You can control cookie settings through your browser preferences, 
                  though this may affect some platform functionality.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Policy Updates</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. When we make changes, we will notify 
                  you by email or through a notice on our platform. The updated policy will be effective 
                  when we post it on this page.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions or concerns about this Privacy Policy or our data practices, 
                  please contact us at privacy@somadz.com or through our support channel on the platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;