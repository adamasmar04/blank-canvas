import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import LocationFilter from "./LocationFilter";
import PackageTypeFilter from "./PackageTypeFilter";
import StatusFilter from "./StatusFilter";
import DurationFilter from "./DurationFilter";
import SortFilter from "./SortFilter";
import CategoryFilter from "./CategoryFilter";

interface AdFiltersProps {
  search: string;
  location: string;
  packageType: string;
  status: string;
  duration: string;
  sortBy: string;
  category?: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPackageTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onCategoryChange: (value: string | undefined) => void;
}

const AdFilters = ({
  search,
  location,
  packageType,
  status,
  duration,
  sortBy,
  category,
  onSearchChange,
  onLocationChange,
  onPackageTypeChange,
  onStatusChange,
  onDurationChange,
  onSortByChange,
  onCategoryChange,
}: AdFiltersProps) => {
  return (
    <div className="glass-card p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search business names, products, services..."
            className="pl-10 pr-6 h-12 text-base"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilter
          selectedCategory={category}
          onCategoryChange={onCategoryChange}
        />
      </div>

      {/* Other Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <LocationFilter
          value={location}
          onChange={onLocationChange}
        />
        
        <PackageTypeFilter
          value={packageType}
          onChange={onPackageTypeChange}
        />
        
        <StatusFilter
          value={status}
          onChange={onStatusChange}
        />
        
        <DurationFilter
          value={duration}
          onChange={onDurationChange}
        />
        
        <SortFilter
          value={sortBy}
          onChange={onSortByChange}
        />
      </div>
    </div>
  );
};

export default AdFilters;
