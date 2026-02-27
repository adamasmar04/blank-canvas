import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, MousePointer, Heart, UserPlus, Smartphone, ShoppingCart } from "lucide-react";

interface CampaignObjectiveSelectorProps {
  campaignObjective: string;
  onCampaignObjectiveChange: (value: string) => void;
}

const objectives = [
  {
    value: "awareness",
    label: "Awareness",
    description: "Show your ads to people who are most likely to remember them.",
    details: "Good for: Reach, Brand awareness, Video views, Store location awareness.",
    icon: Eye
  },
  {
    value: "traffic",
    label: "Traffic",
    description: "Send people to your website or landing page.",
    details: "Good for: Website visits, Link clicks, Landing page views.",
    icon: MousePointer
  },
  {
    value: "engagement",
    label: "Engagement",
    description: "Get more likes, comments, and shares on your content.",
    details: "Good for: Post engagement, Page likes, Event responses.",
    icon: Heart
  },
  {
    value: "leads",
    label: "Leads",
    description: "Collect information from potential customers.",
    details: "Good for: Lead generation, Sign-ups, Contact forms.",
    icon: UserPlus
  },
  {
    value: "app_promotion",
    label: "App Promotion",
    description: "Encourage people to download or use your app.",
    details: "Good for: App installs, App engagement, Mobile app promotion.",
    icon: Smartphone
  },
  {
    value: "sales",
    label: "Sales",
    description: "Drive conversions, product sales, or purchases.",
    details: "Good for: Online sales, Store visits, Catalog sales.",
    icon: ShoppingCart
  }
];

export const CampaignObjectiveSelector = ({ campaignObjective, onCampaignObjectiveChange }: CampaignObjectiveSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Buying Type</Label>
        <Select value="auction" disabled>
          <SelectTrigger className="glass-button border-white/30">
            <SelectValue placeholder="Auction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auction">Auction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">Choose a Campaign Objective *</Label>
        <RadioGroup value={campaignObjective} onValueChange={onCampaignObjectiveChange} className="space-y-4">
          {objectives.map((objective) => {
            const IconComponent = objective.icon;
            return (
              <Card 
                key={objective.value} 
                className={`glass-card border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  campaignObjective === objective.value ? 'ring-2 ring-cyan-500' : ''
                }`}
                onClick={() => onCampaignObjectiveChange(objective.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value={objective.value} id={objective.value} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <IconComponent className="w-5 h-5 text-cyan-600" />
                        <Label htmlFor={objective.value} className="text-lg font-medium cursor-pointer">
                          {objective.label}
                        </Label>
                      </div>
                      <p className="text-gray-700 mb-1">{objective.description}</p>
                      <p className="text-sm text-gray-500">{objective.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
};