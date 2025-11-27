import type { SelectOption } from "@/components/ui/select-with-description";
import type { MultiSelectOption } from "@/components/ui/multi-select-dropdown";

/**
 * Business legal entity type options (incorporation types)
 * Used across the platform for consistency
 */
export const businessLegalEntityTypeOptions: SelectOption[] = [
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "general-partnership", label: "General PartnerShip" },
  { value: "limited-liability-partnership-llp", label: "Limited Liability Partnership (LLP)" },
  { value: "limited-liability-company-llc", label: "Limited Liability Company (LLC)" },
  { value: "private-limited-company", label: "Private Limited Company" },
  { value: "public-limited-company", label: "Public Limited Company" },
  { value: "s-corporation", label: "S Corporation" },
  { value: "c-corporation", label: "C Corporation" },
  { value: "non-profit-organization", label: "Non-Profit Organization" },
];

/**
 * Sector options for businesses
 * Used across the platform for consistency
 */
export const sectorOptions: MultiSelectOption[] = [
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "technology", label: "Technology" },
  { value: "real-estate", label: "Real Estate" },
  { value: "energy", label: "Energy" },
  { value: "agriculture", label: "Agriculture" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "transport-logistics", label: "Transport and Logistics" },
  { value: "tourism-hospitality", label: "Tourism and Hospitality" },
  { value: "construction", label: "Construction" },
  { value: "media-entertainment", label: "Media and Entertainment" },
];

