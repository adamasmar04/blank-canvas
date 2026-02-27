
import React, { useState } from "react";
import {
  Utensils,
  Smartphone,
  Shirt,
  Laptop,
  Home as HomeIcon,
  Plug,
  Baby,
  Puzzle,
  Car,
  Wrench,
  ChevronDown,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";

type CategoryGroup = {
  key: string;
  icon: React.ReactNode;
  label: string;
  subcategories: string[];
};

const CATEGORIES: CategoryGroup[] = [
  {
    key: "books",
    icon: <Puzzle className="w-5 h-5 text-cyan-600" />,
    label: "Books",
    subcategories: [
      "Kids Books",
      "Business & Self-Help Books", 
      "Academic & Exam Prep"
    ],
  },
  {
    key: "fashion",
    icon: <Shirt className="w-5 h-5 text-cyan-600" />,
    label: "Fashion",
    subcategories: [
      "Women's Clothing",
      "Men's Clothing",
      "Kids' Clothing"
    ],
  },
  {
    key: "electronics",
    icon: <Laptop className="w-5 h-5 text-cyan-600" />,
    label: "Electronics",
    subcategories: [
      "Mobile Phones",
      "Laptops & Computers",
      "Home Appliances"
    ],
  },
  {
    key: "food",
    icon: <Utensils className="w-5 h-5 text-cyan-600" />,
    label: "Food & Groceries",
    subcategories: [
      "Fresh Produce",
      "Packaged Foods",
      "Beverages"
    ],
  },
  {
    key: "home",
    icon: <HomeIcon className="w-5 h-5 text-cyan-600" />,
    label: "Home & Garden",
    subcategories: [
      "Furniture",
      "Home Decor",
      "Garden Supplies"
    ],
  },
  {
    key: "vehicles",
    icon: <Car className="w-5 h-5 text-cyan-600" />,
    label: "Vehicles",
    subcategories: [
      "Cars",
      "Motorcycles",
      "Auto Parts"
    ],
  },
  {
    key: "services",
    icon: <Wrench className="w-5 h-5 text-cyan-600" />,
    label: "Services",
    subcategories: [
      "Professional Services",
      "Home Services",
      "Personal Services"
    ],
  },
];

export interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string | undefined) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center py-4">
      {CATEGORIES.map((cat) => (
        <DropdownMenu
          key={cat.key}
          open={openDropdown === cat.key}
          onOpenChange={open => setOpenDropdown(open ? cat.key : null)}
        >
          <DropdownMenuTrigger asChild>
            <button
              className={`glass-button flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition border-white/30 text-gray-700 hover:text-gray-900 ${
                selectedCategory && (selectedCategory === cat.label || cat.subcategories.includes(selectedCategory))
                  ? "ring-2 ring-cyan-500 bg-cyan-50"
                  : ""
              }`}
            >
              {cat.icon}
              <span className="text-sm">{cat.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" className="w-64 glass-card border-white/30 z-50">
            {cat.subcategories.map((sub) => (
              <DropdownMenuItem
                key={sub}
                onClick={() => {
                  if (onCategoryChange) onCategoryChange(sub);
                  setOpenDropdown(null);
                }}
                className="cursor-pointer hover:bg-white/20 text-gray-700"
              >
                {sub}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
      {/* All/Reset */}
      <button
        className="glass-button flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition border-white/30 text-gray-700 hover:text-gray-900"
        onClick={() => {
          if (onCategoryChange) onCategoryChange(undefined);
        }}
      >
        <span className="text-sm">All Categories</span>
      </button>
    </div>
  );
};

export default CategoryFilter;
