"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit, Plus } from "lucide-react";
import { DeleteBandModal } from "./delete-band-modal";

export type ValueBand = {
  id?: string;
  minAmount: number;
  maxAmount: number;
  fee: number;
};

interface ValueBandTableProps {
  bands: ValueBand[];
  onChange: (bands: ValueBand[]) => void;
  feeLabel?: string;
}

import { ValueBandModal } from "./value-band-modal";

export function ValueBandTable({
  bands,
  onChange,
  feeLabel = "RATE (%)",
}: ValueBandTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBand, setEditingBand] = useState<{
    index: number;
    band: ValueBand;
  } | null>(null);
  const [deletingBandIndex, setDeletingBandIndex] = useState<number | null>(null);

  // Determine if we're using rate or fixed amount based on the fee label
  const isRate =
    feeLabel.toLowerCase().includes("rate") ||
    feeLabel.toLowerCase().includes("(%)");

  const handleAddBand = (newBand: ValueBand) => {
    const updatedBands = [...bands, newBand];
    onChange(updatedBands);
  };

  const handleEditBand = (index: number) => {
    setEditingBand({ index, band: { ...bands[index] } });
  };

  const handleSaveEdit = (updatedBand: ValueBand) => {
    if (editingBand) {
      const updatedBands = [...bands];
      updatedBands[editingBand.index] = updatedBand;
      onChange(updatedBands);
      setEditingBand(null);
    }
  };
  
  const confirmDeleteBand = (index: number) => {
    setDeletingBandIndex(index);
  };

  const handleDeleteBand = () => {
    if (deletingBandIndex !== null) {
      const updatedBands = bands.filter((_, i) => i !== deletingBandIndex);
      onChange(updatedBands);
      setDeletingBandIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Value bands configuration</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Band
        </Button>
      </div>

      {bands.length === 0 ? (
        <div className="border border-dashed rounded-md p-8 text-center text-gray-500">
          No value bands have been configured yet!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>MIN AMOUNT (EUR)</TableHead>
              <TableHead>MAX AMOUNT (EUR)</TableHead>
              <TableHead>{feeLabel}</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bands.map((band, index) => (
              <TableRow key={band.id || index}>
                <TableCell>{band.minAmount.toLocaleString()}</TableCell>
                <TableCell>{band.maxAmount.toLocaleString()}</TableCell>
                <TableCell>{band.fee}</TableCell>
                <TableCell className="flex gap-1 items-center justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => handleEditBand(index)}
                    className={"text-green-500 flex gap-1 items-center"}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => confirmDeleteBand(index)}
                    className={"text-red-500 flex gap-1 items-center"}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Modal */}
      <ValueBandModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBand}
        feeLabel={feeLabel}
        isRate={isRate}
      />

      {/* Edit Modal */}
      {editingBand && (
        <ValueBandModal
          open={!!editingBand}
          onClose={() => setEditingBand(null)}
          onSave={handleSaveEdit}
          isEditing={true}
          initialValues={editingBand.band}
          feeLabel={feeLabel}
          isRate={isRate}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteBandModal
        open={deletingBandIndex !== null}
        onClose={() => setDeletingBandIndex(null)}
        onConfirm={handleDeleteBand}
        bandType="value"
      />
    </div>
  );
}
