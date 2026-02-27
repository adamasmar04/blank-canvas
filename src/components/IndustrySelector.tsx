import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface IndustrySelectorProps {
  industry: string;
  subcategory: string;
  onIndustryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

const industries = [
  { value: "books", label: "📚 Books & Education", subcategories: ["Kids Books", "Business & Self-Help", "Academic & Exam Prep"] },
  { value: "fashion", label: "🛍️ Fashion & Clothing", subcategories: ["Men's Wear", "Women's Wear", "Kids & Baby Clothing"] },
  { value: "food", label: "🍽️ Food & Beverage", subcategories: ["Restaurants & Cafes", "Food Delivery", "Organic & Health Foods"] },
  { value: "technology", label: "💻 Technology & Gadgets", subcategories: ["Mobile Phones", "Laptops & Computers", "Smart Home Devices"] },
  { value: "home", label: "🏠 Home & Living", subcategories: ["Furniture & Decor", "Kitchen & Appliances", "Cleaning & Services"] },
  { value: "business", label: "💼 Business Services", subcategories: ["Marketing & Advertising", "Financial Services", "Legal & Consultancy"] },
  { value: "health", label: "🧑‍⚕️ Health & Wellness", subcategories: ["Fitness & Supplements", "Clinics & Pharmacies", "Mental Health & Therapy"] },
  { value: "auto", label: "🚗 Automotive", subcategories: ["Car Sales & Rentals", "Auto Parts", "Repair & Maintenance"] }
];

export const IndustrySelector = ({ industry, subcategory, onIndustryChange, onSubcategoryChange }: IndustrySelectorProps) => {
  const selectedIndustry = industries.find(ind => ind.value === industry);

  const handleIndustryChange = (value: string) => {
    onIndustryChange(value);
    onSubcategoryChange(""); // Reset subcategory when industry changes
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="industry">Choose Your Industry *</Label>
        <Select value={industry} onValueChange={handleIndustryChange}>
          <SelectTrigger className="glass-button border-white/30">
            <SelectValue placeholder="-- Choose Your Industry --" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60">
            {industries.map((ind) => (
              <SelectItem key={ind.value} value={ind.value} className="hover:bg-gray-100">
                {ind.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedIndustry && (
        <div className="space-y-2">
          <Label htmlFor="subcategory">Choose Subcategory *</Label>
          <Select value={subcategory} onValueChange={onSubcategoryChange}>
            <SelectTrigger className="glass-button border-white/30">
              <SelectValue placeholder="-- Choose Subcategory --" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60">
              {selectedIndustry.subcategories.map((sub) => (
                <SelectItem key={sub} value={sub} className="hover:bg-gray-100">
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};