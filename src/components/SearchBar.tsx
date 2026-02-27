
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface SearchBarProps {
  search: string;
  category: string | undefined;
  location: string;
  setSearch: (v: string) => void;
  setCategory: (v: string | undefined) => void;
  setLocation: (v: string) => void;
  categoryOptions: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  category,
  location,
  setSearch,
  setCategory,
  setLocation,
  categoryOptions
}) => (
  <form
    className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-4"
    onSubmit={e => {
      e.preventDefault();
    }}
    autoComplete="off"
  >
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search product name…"
        className="pl-10 pr-6 min-w-[180px] max-w-xs font-opensans"
        name="search"
      />
    </div>
    {/* Category select */}
    <Select
      value={category ?? ""}
      onValueChange={v => setCategory(v.length > 0 ? v : undefined)}
    >
      <SelectTrigger className="min-w-[140px] max-w-xs font-opensans">
        <SelectValue placeholder="All Categories">{category || "All Categories"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Categories</SelectItem>
        {categoryOptions.map((cat) => (
          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    {/* Location */}
    <Input
      value={location}
      onChange={e => setLocation(e.target.value)}
      placeholder="Location (Optional)"
      className="min-w-[140px] max-w-xs font-opensans"
      name="location"
    />
  </form>
);

export default SearchBar;
