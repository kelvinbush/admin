"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  type BusinessSearchItem,
  useAssignBusinessesToGroup,
  useSearchUserGroupBusinesses,
} from "@/lib/api/hooks/user-groups-businesses";
import { toast } from "sonner";
import { Building2, Check, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface AddSmeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onAdded?: () => void;
}

export default function AddSmeModal({
  open,
  onOpenChange,
  groupId,
  onAdded,
}: AddSmeModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<BusinessSearchItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 300);

  // Search businesses
  const { data: searchResults, isLoading } = useSearchUserGroupBusinesses(
    groupId,
    debouncedSearch || undefined,
    {
      page,
      limit,
    },
  );

  const assignMutation = useAssignBusinessesToGroup(groupId);

  const businesses = searchResults?.data || [];
  const totalPages = searchResults?.pagination?.totalPages || 0;

  const toggleSelect = (business: BusinessSearchItem) => {
    // Don't allow selecting businesses already in group
    if (business.isAlreadyInGroup) return;

    setSelected((prev) => {
      const exists = prev.find((b) => b.id === business.id);
      if (exists) return prev.filter((b) => b.id !== business.id);
      return [...prev, business];
    });
  };

  const reset = () => {
    setSearch("");
    setSelected([]);
    setPage(1);
  };

  const onSubmit = async () => {
    if (selected.length === 0) return;

    try {
      const businessIds = selected.map((b) => b.id);
      const result = await assignMutation.mutateAsync({ businessIds });

      // Show detailed feedback
      if (result.assigned > 0) {
        toast.success(
          `Successfully assigned ${result.assigned} business${result.assigned > 1 ? "es" : ""}`,
        );
      }
      if (result.skipped > 0) {
        toast.warning(
          `${result.skipped} business${result.skipped > 1 ? "es were" : " was"} already in the group`,
        );
      }
      if (result.invalid && result.invalid.length > 0) {
        toast.error(
          `${result.invalid.length} invalid business ID${result.invalid.length > 1 ? "s" : ""}`,
        );
      }

      reset();
      onOpenChange(false);
      if (onAdded) onAdded();
    } catch (error: any) {
      console.error("Failed to assign businesses:", error);
      toast.error(
        error?.response?.data?.message || "Failed to assign businesses",
      );
    }
  };

  const handleClose = () => {
    if (!assignMutation.isPending) {
      reset();
      onOpenChange(false);
    }
  };

  const disableSubmit = selected.length === 0 || assignMutation.isPending;

  // Get owner display name
  const getOwnerName = (business: BusinessSearchItem) => {
    if (business.owner.firstName && business.owner.lastName) {
      return `${business.owner.firstName} ${business.owner.lastName}`;
    }
    return business.owner.email;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[900px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-8 py-6 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-midnight-blue">
              Add Businesses
            </DialogTitle>
            <DialogDescription className="text-primaryGrey-500">
              Search and select businesses to add to this group. Businesses
              already in the group are marked and cannot be selected.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 border rounded-md">
            <div className="flex items-center gap-2 px-3 py-2 border-b">
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset to first page on new search
                }}
                placeholder="Search by business name or owner email..."
                className="h-9 border-0 p-0 focus-visible:ring-0 text-sm"
              />
              {search && (
                <button
                  aria-label="Clear"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="text-primaryGrey-400 hover:text-midnight-blue"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-auto">
              {isLoading ? (
                <div className="px-4 py-8 text-center text-sm text-primaryGrey-500">
                  Searching...
                </div>
              ) : businesses.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-primaryGrey-500">
                  {search
                    ? "No businesses found"
                    : "Start typing to search for businesses"}
                </div>
              ) : (
                <>
                  {businesses.map((business) => {
                    const isSelected = selected.some(
                      (b) => b.id === business.id,
                    );
                    const isAlreadyInGroup = business.isAlreadyInGroup;

                    return (
                      <button
                        key={business.id}
                        disabled={isAlreadyInGroup}
                        className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-primaryGrey-50 transition-colors ${isSelected ? "bg-green-50 border-green-200" : ""} ${isAlreadyInGroup ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                        onClick={() => toggleSelect(business)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Building2 className="h-4 w-4 text-primaryGrey-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-midnight-blue truncate">
                                {business.name}
                              </span>
                              {isSelected && (
                                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                            {business.description && (
                              <p className="text-xs text-primaryGrey-500 mb-2 line-clamp-1">
                                {business.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 flex-wrap">
                              {business.sector && (
                                <Badge variant="outline" className="text-xs">
                                  {business.sector}
                                </Badge>
                              )}
                              {business.city && business.country && (
                                <span className="text-xs text-primaryGrey-500">
                                  {business.city}, {business.country}
                                </span>
                              )}
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-primaryGrey-500">
                                Owner:{" "}
                                <span className="text-midnight-blue">
                                  {getOwnerName(business)}
                                </span>
                                {business.owner.email && (
                                  <span className="ml-2">
                                    ({business.owner.email})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {isAlreadyInGroup ? (
                              <Badge
                                variant="outline"
                                className="text-xs border-green-500 text-green-500 bg-green-50"
                              >
                                Already in Group
                              </Badge>
                            ) : isSelected ? (
                              <Badge
                                variant="outline"
                                className="text-xs border-green-500 text-green-500 bg-green-50"
                              >
                                Selected
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-4 py-3 border-t flex items-center justify-between">
                      <p className="text-xs text-primaryGrey-500">
                        Page {page} of {totalPages} •{" "}
                        {searchResults?.pagination?.total || 0} total
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1 || isLoading}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={page >= totalPages || isLoading}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Selected Businesses */}
            {selected.length > 0 && (
              <div className="border-t p-3 bg-primaryGrey-25">
                <p className="text-xs font-medium text-midnight-blue mb-2">
                  Selected ({selected.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.map((business) => (
                    <Badge
                      key={business.id}
                      variant="outline"
                      className="text-xs px-2 py-1 bg-white border-green-500 text-green-600"
                    >
                      {business.name}
                      <button
                        onClick={() =>
                          setSelected((prev) =>
                            prev.filter((b) => b.id !== business.id),
                          )
                        }
                        className="ml-2 hover:text-red-600"
                        aria-label="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-auto border-t pt-6 px-8 pb-6 flex items-center justify-end gap-3 flex-shrink-0">
          <Button
            size="lg"
            variant="outline"
            onClick={handleClose}
            disabled={assignMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            className="text-white border-0"
            style={{
              background:
                "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              opacity: disableSubmit ? 0.7 : 1,
            }}
            onClick={onSubmit}
            disabled={disableSubmit}
          >
            {assignMutation.isPending
              ? "Adding..."
              : `Add ${selected.length > 0 ? `${selected.length} ` : ""}Business${selected.length !== 1 ? "es" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
