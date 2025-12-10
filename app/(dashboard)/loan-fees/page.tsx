"use client";

import { useState, useMemo } from "react";
import { useLoanFees, useDeleteLoanFee, useUnarchiveLoanFeeMutation } from "@/lib/api/hooks/loan-fees";
import { LoanFeesTable, type LoanFeeTableItem } from "./_components/loan-fees-table";
import { CreateLoanFeeModal } from "./_components/create-loan-fee-modal";
import { EditLoanFeeModal } from "./_components/edit-loan-fee-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function LoanFeesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<LoanFeeTableItem | null>(null);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  // Build filters for API
  const apiFilters = useMemo(() => {
    return {
      search: searchValue || undefined,
      includeArchived: showArchived,
    };
  }, [searchValue, showArchived]);

  // Fetch loan fees
  const { data: loanFeesData, isLoading } = useLoanFees(apiFilters, { page, limit });
  const deleteMutation = useDeleteLoanFee();
  const unarchiveMutation = useUnarchiveLoanFeeMutation();

  // Transform API data to table format
  const tableData: LoanFeeTableItem[] = useMemo(() => {
    if (!loanFeesData?.items) return [];
    return loanFeesData.items.map((fee) => ({
      id: fee.id,
      name: fee.name,
      calculationMethod: fee.calculationMethod,
      rate: fee.rate,
      collectionRule: fee.collectionRule,
      allocationMethod: fee.allocationMethod,
      calculationBasis: fee.calculationBasis,
      isArchived: fee.isArchived,
      createdAt: fee.createdAt,
      updatedAt: fee.updatedAt,
    }));
  }, [loanFeesData]);

  const total = loanFeesData?.total || 0;
  const hasLoanFees = total > 0;

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const fee = tableData.find((f) => f.id === id);
    if (fee) {
      setEditingFee(fee);
      setEditModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this loan fee? It will be archived if linked to loan products.")) {
      return;
    }

    try {
      setActionBusyId(id);
      await deleteMutation.mutateAsync({ id });
      toast.success("Loan fee deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete loan fee:", error);
      toast.error(error?.response?.data?.message || "Failed to delete loan fee");
    } finally {
      setActionBusyId(null);
    }
  };

  const handleUnarchive = async (id: string) => {
    try {
      setActionBusyId(id);
      await unarchiveMutation.mutateAsync({ id });
      toast.success("Loan fee unarchived successfully");
    } catch (error: any) {
      console.error("Failed to unarchive loan fee:", error);
      toast.error(error?.response?.data?.message || "Failed to unarchive loan fee");
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
            <h1 className="text-2xl font-semibold text-midnight-blue">Loan Fees</h1>
            <p className="text-sm text-primaryGrey-500 mt-1">
              Manage loan fees that can be attached to loan products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowArchived(!showArchived)}
            >
              {showArchived ? "Hide Archived" : "Show Archived"}
            </Button>
            <Button
              onClick={handleCreate}
              className="h-9 px-4 text-white border-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Loan Fee
            </Button>
          </div>
        </div>

        {/* Table */}
        {!hasLoanFees && !isLoading ? (
          <div className="flex-1 min-h-[320px] rounded-xl border border-dashed border-primaryGrey-200 bg-primaryGrey-25 flex items-center justify-center">
            <div className="text-center">
              <p className="text-primaryGrey-500 mb-4">No loan fees found</p>
              <Button
                onClick={handleCreate}
                variant="outline"
              >
                Create Loan Fee
              </Button>
            </div>
          </div>
        ) : (
          <LoanFeesTable
            data={tableData}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUnarchive={handleUnarchive}
            actionBusyId={actionBusyId}
            showArchived={showArchived}
          />
        )}
      </section>

      {/* Modals */}
      <CreateLoanFeeModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={() => {
          // Data will refresh automatically via query invalidation
        }}
      />

      {editingFee && (
        <EditLoanFeeModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          loanFeeId={editingFee.id}
          initialData={{
            name: editingFee.name,
            calculationMethod: editingFee.calculationMethod,
            rate: editingFee.rate,
            collectionRule: editingFee.collectionRule,
            allocationMethod: editingFee.allocationMethod,
            calculationBasis: editingFee.calculationBasis,
          }}
          onUpdated={() => {
            setEditingFee(null);
            // Data will refresh automatically via query invalidation
          }}
        />
      )}
    </div>
  );
}

