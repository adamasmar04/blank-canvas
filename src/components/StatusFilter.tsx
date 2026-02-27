import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const statusOptions = [
  "Show Only Active Ads",
  "Show Expired Ads"
];

const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-[130px]">
        <SelectValue placeholder="🟢 Show Only Active Ads" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;