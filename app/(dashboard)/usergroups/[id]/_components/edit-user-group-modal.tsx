"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateUserGroupMutation } from "@/lib/api/hooks/useUserGroups";
import {
  useSearchUserGroupBusinesses,
  type BusinessSearchItem,
} from "@/lib/api/hooks/user-groups-businesses";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

interface EditUserGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  initialName?: string;
  initialSlug?: string;
  initialDescription?: string;
  onUpdated?: () => void;
}

export default function EditUserGroupModal({
  open,
  onOpenChange,
  groupId,
  initialName = "",
  initialSlug = "",
  initialDescription = "",
  onUpdated,
}: EditUserGroupModalProps) {
  const [name, setName] = React.useState(initialName);
  const [slug, setSlug] = React.useState(initialSlug);
  const [description, setDescription] = React.useState(initialDescription);
   const [search, setSearch] = React.useState("");
  const [selectedBusinessIds, setSelectedBusinessIds] = React.useState<string[]>([]);
  const [initializedSelection, setInitializedSelection] = React.useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const {
    data: businessSearch,
    isLoading: isLoadingBusinesses,
  } = useSearchUserGroupBusinesses(groupId, debouncedSearch || undefined, {
    page: 1,
    limit: 500,
  });

  const businesses: BusinessSearchItem[] = businessSearch?.data || [];

  const updateMutation = useUpdateUserGroupMutation();

  React.useEffect(() => {
    setName(initialName || "");
    setSlug(initialSlug || "");
    setDescription(initialDescription || "");
  }, [initialName, initialSlug, initialDescription]);

  // Initialize selected businesses from current group membership once
  React.useEffect(() => {
    if (initializedSelection) return;
    if (!businesses.length) return;

    const inGroupIds = businesses
      .filter((b) => b.isAlreadyInGroup)
      .map((b) => b.id);

    setSelectedBusinessIds(inGroupIds);
    setInitializedSelection(true);
  }, [businesses, initializedSelection]);

  const onSubmit = async () => {
    try {
    const body: any = { id: groupId };
    if (name) body.name = name;
    if (slug) body.slug = slug;
    if (description) body.description = description;
      body.businessIds = selectedBusinessIds;

    await updateMutation.mutateAsync(body);
      toast.success("User group updated successfully");
    onOpenChange(false);
    if (onUpdated) onUpdated();
    } catch (error: any) {
      console.error("Failed to update user group:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update user group",
      );
    }
  };

  const disableSubmit = updateMutation.isPending || !name;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!updateMutation.isPending) onOpenChange(o); }}>
      <DialogContent className="max-w-[760px] p-0 overflow-hidden">
        <div className="px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-midnight-blue">Edit user group</DialogTitle>
            <DialogDescription className="text-primaryGrey-500">
              Update the details for this user group
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-midnight-blue font-medium">Group name <span className="text-red-500">*</span></label>
              <Input placeholder="Enter user group name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-midnight-blue font-medium">Group no/identifier (optional)</label>
              <Input placeholder="Enter user group identifier" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-midnight-blue font-medium">
                Linked SMEs
              </label>
              <div className="mt-2 border rounded-md">
                <div className="flex items-center gap-2 px-3 py-2 border-b">
                  <Search className="h-4 w-4 text-primaryGrey-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search business or owner..."
                    className="h-8 border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-primaryGrey-400"
                  />
                </div>
                <ScrollArea className="h-60">
                  <div className="divide-y">
                    {isLoadingBusinesses && (
                      <div className="px-4 py-3 text-sm text-primaryGrey-500">
                        Loading businesses...
                      </div>
                    )}
                    {!isLoadingBusinesses && businesses.length === 0 && (
                      <div className="px-4 py-3 text-sm text-primaryGrey-500">
                        No SMEs found. Try a different search.
                      </div>
                    )}
                    {businesses.map((b) => {
                      const checked = selectedBusinessIds.includes(b.id);
                      const ownerName =
                        `${b.owner.firstName || ""} ${
                          b.owner.lastName || ""
                        }`.trim() || b.owner.email;
                      const location =
                        b.city && b.country
                          ? `${b.city}, ${b.country}`
                          : b.city || b.country || "—";

                      return (
                        <label
                          key={b.id}
                          className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-primaryGrey-50"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(val) => {
                              setSelectedBusinessIds((prev) =>
                                val
                                  ? [...prev, b.id]
                                  : prev.filter((id) => id !== b.id),
                              );
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm text-midnight-blue">
                              {b.name}
                            </span>
                            <span className="text-xs text-primaryGrey-500">
                              {ownerName} • {location}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div>
              <label className="text-sm text-midnight-blue font-medium">
                Description (optional)
              </label>
              <Textarea
                placeholder="Briefly describe the user group here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[96px]"
              />
            </div>
          </div>

          {/* Legacy description placement replaced by two-column layout above */}
          {/* <div className="mt-6">
            <label className="text-sm text-midnight-blue font-medium">Description (optional)</label>
            <Textarea
              placeholder="Briefly describe the user group here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[96px]"
            />
          </div> */}

          <DialogFooter className="mt-8 border-t pt-6 flex items-center justify-end gap-3">
            <Button size="lg" variant="outline" onClick={() => onOpenChange(false)} disabled={updateMutation.isPending}>Cancel</Button>
            <Button
              size="lg"
              className="text-white border-0"
              style={{ background: "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)", opacity: disableSubmit ? 0.7 : 1 }}
              onClick={onSubmit}
              disabled={disableSubmit}
            >
              Save changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
