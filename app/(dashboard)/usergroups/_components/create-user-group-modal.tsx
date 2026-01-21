"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateUserGroupMutation } from "@/lib/api/hooks/useUserGroups";
import {
  useSearchBusinesses,
  type BusinessSearchItem,
} from "@/lib/api/hooks/loan-applications";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

interface CreateUserGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (groupId: string) => void;
}

export default function CreateUserGroupModal({ open, onOpenChange, onCreated }: CreateUserGroupModalProps) {
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [selectedBusinessIds, setSelectedBusinessIds] = React.useState<string[]>([]);

  const debouncedSearch = useDebounce(search, 300);

  const {
    data: businessSearch,
    isLoading: isLoadingBusinesses,
  } = useSearchBusinesses(debouncedSearch || undefined, {
    page: 1,
    limit: 50,
  });

  const businesses: BusinessSearchItem[] = businessSearch?.data || [];

  const createMutation = useCreateUserGroupMutation();

  const reset = () => {
    setName("");
    setSlug("");
    setDescription("");
    setSearch("");
    setSelectedBusinessIds([]);
  };

  const onSubmit = async () => {
    try {
      const body: any = {
        name,
        businessIds: selectedBusinessIds.length ? selectedBusinessIds : undefined,
      };
      if (slug) body.slug = slug;
      if (description) body.description = description;

      const created = await createMutation.mutateAsync(body);
      toast.success("User group created successfully");
      onOpenChange(false);
      reset();
      if (onCreated && created?.id) onCreated(created.id);
    } catch (error: any) {
      console.error("Failed to create user group:", error);
      toast.error(error?.response?.data?.message || "Failed to create user group");
    }
  };

  const disableSubmit = !name || createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!createMutation.isPending) onOpenChange(o); }}>
      <DialogContent className="max-w-[900px] p-0 overflow-hidden">
        <div className="px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-midnight-blue">Create user group</DialogTitle>
            <DialogDescription className="text-primaryGrey-500">
              Fill in the details below to create a new user group
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-midnight-blue font-medium">Group name <span className="text-red-500">*</span></label>
              <Input placeholder="Enter user group name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-midnight-blue font-medium">Group no/identifier (optional)</label>
              <Input placeholder="Enter user group identifier" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>

          {/* Add SMEs (optional) */}
          <div className="mt-6 space-y-3">
            <label className="text-sm text-midnight-blue font-medium">
              Add SMEs (optional)
            </label>
            <div className="border rounded-md">
              <div className="flex items-center gap-2 px-3 py-2 border-b">
                <Search className="h-4 w-4 text-primaryGrey-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search business or owner..."
                  className="h-8 border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-primaryGrey-400"
                />
              </div>
              <ScrollArea className="max-h-60">
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
                    const ownerName = `${b.owner.firstName || ""} ${b.owner.lastName || ""}`.trim() ||
                      b.owner.email;
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

          <div className="mt-6">
            <label className="text-sm text-midnight-blue font-medium">Description (optional)</label>
            <Textarea
              placeholder="Briefly describe the user group here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[96px]"
            />
          </div>

          <DialogFooter className="mt-8 border-t pt-6 flex items-center justify-end gap-3">
            <Button size="lg" variant="outline" onClick={() => onOpenChange(false)} disabled={createMutation.isPending}>Cancel</Button>
            <Button
              size="lg"
              className="text-white border-0"
              style={{
                background: "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                opacity: disableSubmit ? 0.7 : 1,
              }}
              onClick={onSubmit}
              disabled={disableSubmit}
            >
              Submit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
