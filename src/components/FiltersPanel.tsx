import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocationFilter from "./LocationFilter";
import PackageTypeFilter from "./PackageTypeFilter";
import StatusFilter from "./StatusFilter";
import DurationFilter from "./DurationFilter";
import SortFilter from "./SortFilter";
import CategoryFilterSelect from "./CategoryFilterSelect";
interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  packageType: string;
  category: string;
  status: string;
  duration: string;
  sortBy: string;
  onLocationChange: (value: string) => void;
  onPackageTypeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onSortByChange: (value: string) => void;
}
const FiltersPanel = ({
  isOpen,
  onClose,
  location,
  packageType,
  category,
  status,
  duration,
  sortBy,
  onLocationChange,
  onPackageTypeChange,
  onCategoryChange,
  onStatusChange,
  onDurationChange,
  onSortByChange
}: FiltersPanelProps) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="glass-card border-white/30 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">🔍 Filter Ads</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:bg-white/50">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              📍 <span>Location</span>
            </label>
            <LocationFilter value={location} onChange={onLocationChange} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              📦 <span>Package Type</span>
            </label>
            <PackageTypeFilter value={packageType} onChange={onPackageTypeChange} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              🎯 <span>Category</span>
            </label>
            <CategoryFilterSelect value={category} onChange={onCategoryChange} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              🟢 <span>Status</span>
            </label>
            <StatusFilter value={status} onChange={onStatusChange} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              ⏰ <span>Duration Remaining</span>
            </label>
            <DurationFilter value={duration} onChange={onDurationChange} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              ⭐ <span>Sort By</span>
            </label>
            <SortFilter value={sortBy} onChange={onSortByChange} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-white/20">
          <Button 
            variant="outline" 
            onClick={() => {
              onLocationChange("Global / All Locations");
              onPackageTypeChange("All Packages");
              onCategoryChange("All Categories");
              onStatusChange("Show Only Active Ads");
              onDurationChange("All Durations");
              onSortByChange("Newest First");
            }} 
            className="glass-button border-white/30 text-gray-700 hover:bg-white/50"
          >
            Clear All Filters
          </Button>
          <Button 
            onClick={onClose} 
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>;
};
export default FiltersPanel;