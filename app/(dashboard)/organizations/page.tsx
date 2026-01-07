"use client";

import { useState, useMemo } from "react";
import {
  useOrganizations,
  useDeleteOrganization,
} from "@/lib/api/hooks/organizations";
import {
  OrganizationsTable,
  type OrganizationTableItem,
} from "./_components/organizations-table";
import { CreateOrganizationModal } from "./_components/create-organization-modal";
import { EditOrganizationModal } from "./_components/edit-organization-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function OrganizationsPage() {
  const [page] = useState(1);
  const [limit] = useState(20);
  const [searchValue] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationTableItem | null>(
    null,
  );
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  // Build filters for API
  const apiFilters = useMemo(() => {
    return {
      search: searchValue || undefined,
    };
  }, [searchValue]);

  // Fetch organizations
  const { data: organizationsData, isLoading } = useOrganizations(apiFilters, {
    page,
    limit,
  });
  const deleteMutation = useDeleteOrganization();

  // Transform API data to table format
  const tableData: OrganizationTableItem[] = useMemo(() => {
    if (!organizationsData?.items) return [];
    return organizationsData.items.map((org) => ({
      id: org.id,
      name: org.name,
      description: org.description,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    }));
  }, [organizationsData]);

  const total = organizationsData?.total || 0;
  const hasOrganizations = total > 0;

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const org = tableData.find((o) => o.id === id);
    if (org) {
      setEditingOrg(org);
      setEditModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) {
      return;
    }

    try {
      setActionBusyId(id);
      await deleteMutation.mutateAsync({ id });
      toast.success("Organization deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete organization:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete organization",
      );
    } finally {
      setActionBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-midnight-blue">
              Organizations
            </h1>
            <p className="text-sm text-primaryGrey-500 mt-1">
              Manage loan provider organizations
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="h-9 px-4 text-white border-0"
            style={{
              background:
                "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        </div>

        {/* Table */}
        {!hasOrganizations && !isLoading ? (
          <div className="flex-1 min-h-[320px] rounded-xl border border-dashed border-primaryGrey-200 bg-primaryGrey-25 flex items-center justify-center">
            <div className="text-center">
              <p className="text-primaryGrey-500 mb-4">
                No organizations found
              </p>
              <Button onClick={handleCreate} variant="outline">
                Create Organization
              </Button>
            </div>
          </div>
        ) : (
          <OrganizationsTable
            data={tableData}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            actionBusyId={actionBusyId}
          />
        )}
      </section>

      {/* Modals */}
      <CreateOrganizationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={() => {
          // Data will refresh automatically via query invalidation
        }}
      />

      {editingOrg && (
        <EditOrganizationModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          organizationId={editingOrg.id}
          initialName={editingOrg.name}
          initialDescription={editingOrg.description}
          onUpdated={() => {
            setEditingOrg(null);
            // Data will refresh automatically via query invalidation
          }}
        />
      )}
    </div>
  );
}
