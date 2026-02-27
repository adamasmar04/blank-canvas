import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  DollarSign, 
  Upload, 
  CreditCard, 
  MessageCircle,
  ArrowRight 
} from "lucide-react";
import Navigation from "@/components/Navigation";
import ContactForm from "@/components/ContactForm";

const FAQ = () => {
  const faqCategories = [
    {
      title: "General",
      icon: HelpCircle,
      color: "bg-blue-500",
      questions: [
        {
          question: "What is SomAdz?",
          answer: "SomAdz is Somalia's premier advertising platform that helps businesses reach new customers and expand their sales beyond their local area. We provide modern advertising solutions for businesses of all sizes."
        },
        {
          question: "How does SomAdz work?",
          answer: "Simply create an account, choose your advertising package, upload your ad content (images or videos), and publish. Your ads will be visible to thousands of potential customers across Somalia and beyond."
        },
        {
          question: "Who can use SomAdz?",
          answer: "Any business owner, entrepreneur, or individual looking to advertise their products or services can use SomAdz. From small local shops to large enterprises, our platform is designed for everyone."
        },
        {
          question: "Is SomAdz available in Somali language?",
          answer: "Yes, we support both English and Somali languages to make our platform accessible to all users in Somalia."
        }
      ]
    },
    {
      title: "Pricing & Plans",
      icon: DollarSign,
      color: "bg-green-500",
      questions: [
        {
          question: "What packages do you offer?",
          answer: "We offer three packages: Basic ($3 for 1 day), Standard ($9.50 for 3 days), and Premium ($21.99 for 7 days). Each package includes different features and duration."
        },
        {
          question: "What's included in the Basic package?",
          answer: "Basic package includes 1 image/video upload, basic analytics, social media marketing (Facebook, Instagram, TikTok), and basic support for 1 day."
        },
        {
          question: "What's included in the Standard package?",
          answer: "Standard package includes 3 image/video uploads, enhanced analytics, social media marketing, email marketing, featured ad placement, and support for 3 days."
        },
        {
          question: "What's included in the Premium package?",
          answer: "Premium package includes 5 image/video uploads, comprehensive analytics, social media sharing, email marketing, premium ad placement, and priority support for 7 days."
        },
        {
          question: "Can I upgrade my package?",
          answer: "Yes, you can upgrade your package at any time. Contact our support team for assistance with package upgrades."
        }
      ]
    },
    {
      title: "Ad Posting",
      icon: Upload,
      color: "bg-purple-500",
      questions: [
        {
          question: "How do I upload an ad?",
          answer: "Click 'Create Ad' button, fill in your business details, choose your package, upload your images or videos, review your ad, and publish. It's that simple!"
        },
        {
          question: "What file formats are supported?",
          answer: "We support common image formats (JPG, PNG, GIF) and video formats (MP4, MOV, AVI). Maximum file size is 10MB per file."
        },
        {
          question: "How long does it take for my ad to go live?",
          answer: "Most ads go live within 15 minutes after payment confirmation. Premium ads may be reviewed and go live within 2 hours."
        },
        {
          question: "Can I edit my ad after publishing?",
          answer: "You can make minor edits to your ad description and contact information. For major changes, please contact our support team."
        },
        {
          question: "How do I track my ad performance?",
          answer: "Visit your profile page to see detailed analytics including views, clicks, and engagement rates for all your ads."
        }
      ]
    },
    {
      title: "Payments",
      icon: CreditCard,
      color: "bg-yellow-500",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept major credit cards, mobile money payments (EVC Plus, Zaad), and bank transfers. All payments are processed securely."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard encryption and secure payment processors to protect your financial information."
        },
        {
          question: "Can I get a refund?",
          answer: "Refunds are available within 24 hours of payment if your ad hasn't gone live. Contact support for refund requests."
        },
        {
          question: "Do you offer payment plans?",
          answer: "Currently, all packages require full payment upfront. We're working on introducing payment plans for larger advertising campaigns."
        }
      ]
    },
    {
      title: "Support",
      icon: MessageCircle,
      color: "bg-cyan-500",
      questions: [
        {
          question: "How can I contact support?",
          answer: "You can reach us through the live chat widget, email us at support@somadz.com, or call us during business hours. We're here to help!"
        },
        {
          question: "What are your support hours?",
          answer: "Our support team is available 24/7 through live chat. Phone support is available Sunday to Thursday, 8 AM to 6 PM (Somalia time)."
        },
        {
          question: "How quickly do you respond to support requests?",
          answer: "Live chat responses are usually within 5 minutes. Email responses within 2 hours during business hours."
        },
        {
          question: "Do you provide technical assistance?",
          answer: "Yes, our technical support team can help with ad creation, payment issues, account problems, and platform navigation."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="glass-card p-8 mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about SomAdz. Can't find what you're looking for? 
            Use the contact form below or live chat support.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8 mb-12">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`${category.color} p-2 rounded-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="gradient-text">{category.title}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {category.questions.length} questions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((qa, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${categoryIndex}-${index}`}
                      className="border-white/20"
                    >
                      <AccordionTrigger className="text-left hover:text-cyan-600 transition-colors">
                        {qa.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {qa.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* Still Need Help Section */}
        <Card className="glass-card border-white/20 mt-12">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-4">
              Need Immediate Help?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              For urgent matters, you can also use our live chat support available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-gray-600">
                <ArrowRight className="w-4 h-4 text-cyan-600" />
                <span>Use the chat widget below</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ArrowRight className="w-4 h-4 text-cyan-600" />
                <span>Email: support@somadz.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
