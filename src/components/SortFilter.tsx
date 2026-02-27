import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SortFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const sortOptions = [
  "Newest First",
  "Most Popular",
  "Price: Low to High",
  "Price: High to Low"
];

const SortFilter = ({ value, onChange }: SortFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-[150px]">
        <SelectValue placeholder="⭐ Newest First" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((sort) => (
          <SelectItem key={sort} value={sort}>
            {sort}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortFilter;