"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface OrganizationsFiltersProps {
  onFilterChange: (filters: {
    affiliationType?: string;
    createdBy?: string;
    createdAt?: string;
  }) => void;
}

export function OrganizationsFilters({ onFilterChange }: OrganizationsFiltersProps) {
  const [tempFilters, setTempFilters] = useState({
    affiliationType: "",
    createdBy: "",
    createdAt: ""
  });

  const handleAffiliationTypeChange = (value: string) => {
    setTempFilters(prev => ({ ...prev, affiliationType: value }));
  };

  const handleCreatedByChange = (value: string) => {
    setTempFilters(prev => ({ ...prev, createdBy: value }));
  };

  const handleCreatedAtChange = (value: string) => {
    setTempFilters(prev => ({ ...prev, createdAt: value }));
  };
  
  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <Select onValueChange={handleAffiliationTypeChange}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="AFFILIATION TYPE" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="mk-partner">MK Partner</SelectItem>
          <SelectItem value="investor">Investor</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={handleCreatedByChange}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="CREATED BY" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="melanie-keita">Melanie Keita</SelectItem>
          <SelectItem value="jessica-kagisye">Jessica Kagisye</SelectItem>
          <SelectItem value="kelvin-wachiye">Kelvin Wachiye</SelectItem>
          <SelectItem value="shalyne-waweru">Shalyne Waweru</SelectItem>
          <SelectItem value="sylvia-silamoi">Sylvia Silamoi</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={handleCreatedAtChange}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="CREATED AT" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="last-week">Last Week</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="last-3-months">Last 3 Months</SelectItem>
          <SelectItem value="last-year">Last Year</SelectItem>
        </SelectContent>
      </Select>

      <Button 
        className="bg-[#00CC99] hover:bg-[#00BB88] text-white"
        onClick={handleApplyFilters}
      >
        APPLY
      </Button>
    </div>
  );
}
