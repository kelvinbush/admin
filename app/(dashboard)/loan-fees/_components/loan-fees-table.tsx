"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export type LoanFeeTableItem = {
  id: string;
  name: string;
  calculationMethod: "flat" | "percentage";
  rate: number;
  collectionRule: "upfront" | "end_of_term";
  allocationMethod: string;
  calculationBasis: "principal" | "total_disbursed";
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

interface LoanFeesTableProps {
  data: LoanFeeTableItem[];
  isLoading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  actionBusyId?: string | null;
  showArchived?: boolean;
}

export function LoanFeesTable({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  onUnarchive,
  actionBusyId,
}: LoanFeesTableProps) {
  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primaryGrey-50">
                  <TableHead className="font-medium text-primaryGrey-500 py-4">
                    NAME
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    CALCULATION METHOD
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    RATE
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    COLLECTION RULE
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    STATUS
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return null; // Empty state handled by parent
  }

  return (
    <Card className="shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primaryGrey-50">
                <TableHead className="font-medium text-primaryGrey-500 py-4">
                  NAME
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  CALCULATION METHOD
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  RATE
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  COLLECTION RULE
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  STATUS
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((fee) => {
                const isBusy = actionBusyId === fee.id;

                return (
                  <TableRow
                    key={fee.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="py-4">
                      <div className="text-sm font-medium text-midnight-blue">
                        {fee.name}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500 capitalize">
                        {fee.calculationMethod}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500">
                        {fee.rate}{fee.calculationMethod === "percentage" ? "%" : ""}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500 capitalize">
                        {fee.collectionRule.replace("_", " ")}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`font-normal border text-xs ${
                          fee.isArchived
                            ? "border-yellow-500 text-yellow-500 bg-yellow-50"
                            : "border-green-500 text-green-500 bg-green-50"
                        }`}
                      >
                        {fee.isArchived ? "Archived" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        {!fee.isArchived && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-primary-green hover:text-primary-green hover:bg-green-50"
                            onClick={() => {
                              if (onEdit) {
                                onEdit(fee.id);
                              }
                            }}
                            disabled={isBusy}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {fee.isArchived ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => {
                              if (onUnarchive) {
                                onUnarchive(fee.id);
                              }
                            }}
                            disabled={isBusy}
                            title="Unarchive"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-600 hover:bg-red-50"
                            onClick={() => {
                              if (onDelete) {
                                onDelete(fee.id);
                              }
                            }}
                            disabled={isBusy}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

