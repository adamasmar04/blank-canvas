import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DurationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const durationOptions = [
  "All Durations",
  "Expiring Today",
  "Within 3 Days",
  "This Week"
];

const DurationFilter = ({ value, onChange }: DurationFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-[140px]">
        <SelectValue placeholder="⏰ All Durations" />
      </SelectTrigger>
      <SelectContent>
        {durationOptions.map((duration) => (
          <SelectItem key={duration} value={duration}>
            {duration}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DurationFilter;