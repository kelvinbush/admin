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

export type PeriodBand = {
  id?: string;
  minPeriod: number;
  maxPeriod: number;
  fee: number;
};

// Import the actual component after defining the PeriodBand type
import { PeriodBandModal } from "./period-band-modal";



interface PeriodBandTableProps {
  bands: PeriodBand[];
  onChange: (bands: PeriodBand[]) => void;
  feeLabel?: string;
}

export function PeriodBandTable({
  bands,
  onChange,
  feeLabel = "RATE (%)",
}: PeriodBandTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBand, setEditingBand] = useState<{
    index: number;
    band: PeriodBand;
  } | null>(null);

  // Determine if we're using rate or fixed amount based on the fee label
  const isRate =
    feeLabel.toLowerCase().includes("rate") ||
    feeLabel.toLowerCase().includes("(%)");

  const handleAddBand = (newBand: PeriodBand) => {
    const updatedBands = [...bands, newBand];
    onChange(updatedBands);
  };

  const handleEditBand = (index: number) => {
    setEditingBand({ index, band: { ...bands[index] } });
  };

  const handleSaveEdit = (updatedBand: PeriodBand) => {
    if (editingBand) {
      const updatedBands = [...bands];
      updatedBands[editingBand.index] = updatedBand;
      onChange(updatedBands);
      setEditingBand(null);
    }
  };

  const handleDeleteBand = (index: number) => {
    const updatedBands = bands.filter((_, i) => i !== index);
    onChange(updatedBands);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Period bands configuration</h3>
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
          No period bands have been configured yet!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>MIN PERIOD (MONTHS)</TableHead>
              <TableHead>MAX PERIOD (MONTHS)</TableHead>
              <TableHead>{feeLabel}</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bands.map((band, index) => (
              <TableRow key={band.id || index}>
                <TableCell>{band.minPeriod}</TableCell>
                <TableCell>{band.maxPeriod}</TableCell>
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
                    onClick={() => handleDeleteBand(index)}
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
      <PeriodBandModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBand}
        feeLabel={feeLabel}
        isRate={isRate}
      />

      {/* Edit Modal */}
      {editingBand && (
        <PeriodBandModal
          open={!!editingBand}
          onClose={() => setEditingBand(null)}
          onSave={handleSaveEdit}
          isEditing={true}
          initialValues={editingBand.band}
          feeLabel={feeLabel}
          isRate={isRate}
        />
      )}
    </div>
  );
}
