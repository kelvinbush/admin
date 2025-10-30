"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateUserGroupMutation } from "@/lib/api/hooks/useUserGroups";
import { useSearchUsers } from "@/lib/api/hooks/users";
import type { User } from "@/lib/api/types";
import { X } from "lucide-react";

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
  const [selected, setSelected] = React.useState<User[]>([]);

  const { data: searchResults } = useSearchUsers(search);
  const createMutation = useCreateUserGroupMutation();

  const toggleSelect = (user: User) => {
    setSelected((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) return prev.filter((u) => u.id !== user.id);
      return [...prev, user];
    });
  };

  const reset = () => {
    setName("");
    setSlug("");
    setDescription("");
    setSearch("");
    setSelected([]);
  };

  const onSubmit = async () => {
    const body: any = { name };
    if (slug) body.slug = slug;
    if (description) body.description = description;
    if (selected.length > 0) body.userIds = selected.map((u) => u.id);

    const created = await createMutation.mutateAsync(body);
    onOpenChange(false);
    reset();
    if (onCreated && created?.id) onCreated(created.id);
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

          <div className="mt-6">
            <label className="text-sm text-midnight-blue font-medium">Add SMEs (optional)</label>
            <div className="mt-2 border rounded-md">
              <div className="flex items-center gap-2 px-3 py-2 border-b">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="h-9 border-0 p-0 focus-visible:ring-0 text-sm"
                />
                {search && (
                  <button aria-label="Clear" onClick={() => setSearch("")} className="text-primaryGrey-400 hover:text-midnight-blue">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="max-h-56 overflow-auto">
                {(searchResults || []).map((u) => {
                  const checked = !!selected.find((s) => s.id === u.id);
                  return (
                    <button
                      key={u.id}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-primaryGrey-50 ${checked ? "bg-primaryGrey-50" : ""}`}
                      onClick={() => toggleSelect(u)}
                    >
                      {(u as any).fullName || (u as any).name || (u as any).email || u.id}
                    </button>
                  );
                })}
              </div>
              {selected.length > 0 && (
                <div className="border-t p-3 flex flex-wrap gap-2">
                  {selected.map((u) => (
                    <span key={u.id} className="text-xs px-2 py-1 rounded-md bg-primaryGrey-100 text-midnight-blue">
                      {(u as any).fullName || (u as any).name || (u as any).email || u.id}
                    </span>
                  ))}
                </div>
              )}
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
