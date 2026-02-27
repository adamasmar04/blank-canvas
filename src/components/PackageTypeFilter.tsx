import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PackageTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const packageTypes = [
  "All Packages",
  "Basic",
  "Standard", 
  "Premium"
];

const PackageTypeFilter = ({ value, onChange }: PackageTypeFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-[140px]">
        <SelectValue placeholder="📦 All Packages" />
      </SelectTrigger>
      <SelectContent>
        {packageTypes.map((packageType) => (
          <SelectItem key={packageType} value={packageType}>
            {packageType}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PackageTypeFilter;