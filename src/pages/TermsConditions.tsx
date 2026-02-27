import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsConditions = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="glass-card border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold gradient-text mb-4">
                Terms & Conditions
              </CardTitle>
              <p className="text-gray-600">
                Last updated: January 2025
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Service Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  SomAdz is an advertising platform that allows small businesses to publish their advertisements 
                  and reach new customers. Our platform provides tools for creating, managing, and promoting 
                  business advertisements across various channels including social media and digital marketing.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Terms of Use</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using SomAdz, you agree to comply with these Terms & Conditions. 
                  You must be at least 18 years old or have parental consent to use our services. 
                  You are responsible for maintaining the security of your account credentials.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  SomAdz is not responsible for errors in advertisement content, misuse of the platform, 
                  or third-party activities. We provide the platform "as is" and make no warranties about 
                  the effectiveness of advertisements or guarantee of results. Users are responsible for 
                  the accuracy and legality of their content.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">User Accountability</h2>
                <p className="text-gray-600 leading-relaxed">
                  Users must ensure their advertisements comply with applicable laws and regulations. 
                  You are responsible for the content you upload and must not post illegal, offensive, 
                  misleading, or infringing material. Users must respect intellectual property rights 
                  and not engage in spam or abusive behavior.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Suspension or Termination of Accounts</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these terms, 
                  engage in fraudulent activities, or behave inappropriately. Account termination 
                  may result in loss of access to services and forfeiture of any unused credits or payments.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Ownership of Content</h2>
                <p className="text-gray-600 leading-relaxed">
                  Users retain ownership of their advertisement content. However, by using SomAdz, 
                  you grant us a non-exclusive license to display, distribute, and promote your 
                  advertisements through our platform and marketing channels to provide our services effectively.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Applicable Laws</h2>
                <p className="text-gray-600 leading-relaxed">
                  All policies and terms are aligned with ICT and data protection laws, including GDPR. 
                  These terms are governed by applicable local and international laws. Any disputes 
                  will be resolved through appropriate legal channels in accordance with these regulations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Changes to the Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update these Terms & Conditions from time to time to reflect changes in our 
                  services or legal requirements. Users will be notified of significant changes via 
                  email or platform notifications. Continued use of the platform constitutes acceptance 
                  of the updated terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold gradient-text mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about these Terms & Conditions, please contact us at 
                  legal@somadz.com or through our support channel on the platform.
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

export default TermsConditions;