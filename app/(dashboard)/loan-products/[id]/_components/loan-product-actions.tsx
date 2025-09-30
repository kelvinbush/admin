"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Archive, FileText, Edit, Trash2 } from "lucide-react";
import { LoanProduct } from "@/lib/api/types";
import { useUpdateLoanProductStatus } from "@/lib/api/hooks/loan-products";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface LoanProductActionsProps {
  product: LoanProduct;
}

export function LoanProductActions({ product }: LoanProductActionsProps) {
  const { user } = useUser();
  const router = useRouter();
  const updateStatusMutation = useUpdateLoanProductStatus();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [changeReason, setChangeReason] = useState('');

  const getStatusTransition = (currentStatus: string) => {
    switch (currentStatus) {
      case 'draft':
        return { next: 'active', label: 'Activate Product', icon: CheckCircle, color: 'text-green-500' };
      case 'active':
        return { next: 'archived', label: 'Archive Product', icon: Archive, color: 'text-red-500' };
      case 'archived':
        return { next: 'active', label: 'Reactivate Product', icon: CheckCircle, color: 'text-green-500' };
      default:
        return null;
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus || !changeReason || !user?.id) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: product.id,
        status: newStatus,
        changeReason,
        approvedBy: user.id
      });
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'archived'} successfully`);
      setStatusDialogOpen(false);
      setChangeReason('');
    } catch (error) {
      toast.error('Failed to update product status');
      console.error('Error updating status:', error);
    }
  };

  const handleEdit = () => {
    router.push(`/loan-products/${product.id}/edit`);
  };

  const statusTransition = getStatusTransition(product.status);

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-midnight-blue">
          Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Edit Product */}
        <Button
          onClick={handleEdit}
          className="w-full bg-primary-green hover:bg-primary-green/90"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Product
        </Button>

        {/* Status Change */}
        {statusTransition && (
          <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className={`w-full ${statusTransition.color} hover:bg-opacity-10`}
                onClick={() => {
                  setNewStatus(statusTransition.next);
                  setStatusDialogOpen(true);
                }}
              >
                <statusTransition.icon className="h-4 w-4 mr-2" />
                {statusTransition.label}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Product Status</DialogTitle>
                <DialogDescription>
                  You are about to change this product status from <strong>{product.status}</strong> to <strong>{statusTransition.next}</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="changeReason">Reason for change *</Label>
                  <Textarea
                    id="changeReason"
                    placeholder="Enter the reason for this status change..."
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setStatusDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusChange}
                  disabled={!changeReason || updateStatusMutation.isPending}
                  className="bg-primary-green hover:bg-primary-green/90"
                >
                  {updateStatusMutation.isPending ? 'Updating...' : `Confirm ${statusTransition.label}`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* View Applications (placeholder for future feature) */}
        <Button
          variant="outline"
          className="w-full text-primaryGrey-400 hover:text-primaryGrey-500"
          disabled
        >
          <FileText className="h-4 w-4 mr-2" />
          View Applications
          <span className="ml-2 text-xs">(Coming Soon)</span>
        </Button>
      </CardContent>
    </Card>
  );
}
