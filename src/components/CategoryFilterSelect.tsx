import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const categoryOptions = [
  "All Categories",
  "Clothing",
  "Men's Clothing",
  "Women's Clothing",
  "Children's Clothing",
  "Food & Beverage",
  "Electronics",
  "Services",
  "Vehicles",
  "Real Estate"
];

const CategoryFilterSelect = ({ value, onChange }: CategoryFilterSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-[150px]">
        <SelectValue placeholder="🎯 All Categories" />
      </SelectTrigger>
      <SelectContent>
        {categoryOptions.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilterSelect;