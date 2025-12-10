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
import { Pencil, Power } from "lucide-react";
import { useRouter } from "next/navigation";

// Placeholder type for loan product
export type LoanProductTableItem = {
  id: string;
  code: string;
  name: string;
  provider: string;
  visibility: string;
  linkedSmes: number;
  linkedLoans: number;
  status: "active" | "inactive";
};

interface LoanProductsTableProps {
  data: LoanProductTableItem[];
  isLoading?: boolean;
  onEdit?: (id: string) => void;
  onToggleStatus?: (id: string, currentStatus: "active" | "inactive") => void;
  actionBusyId?: string | null;
}

export function LoanProductsTable({
  data,
  isLoading = false,
  onEdit,
  onToggleStatus,
  actionBusyId,
}: LoanProductsTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primaryGrey-50">
                  <TableHead className="font-medium text-primaryGrey-500 py-4">
                    CODE
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    LOAN NAME
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    LOAN PROVIDER
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    LOAN VISIBILITY
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    LINKED SME(S)
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    LINKED LOANS
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
                      <div className="h-4 w-20 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-4 w-32 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-4 w-28 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-4 w-24 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-4 w-16 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-4 w-16 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-6 w-20 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primaryGrey-50 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-primaryGrey-50 rounded animate-pulse" />
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
    return null; // Empty state is handled by parent
  }

  return (
    <Card className="shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primaryGrey-50">
                <TableHead className="font-medium text-primaryGrey-500 py-4">
                  CODE
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  LOAN NAME
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  LOAN PROVIDER
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  LOAN VISIBILITY
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  LINKED SME(S)
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  LINKED LOANS
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
              {data.map((product) => {
                const isActive = product.status === "active";
                const isBusy = actionBusyId === product.id;

                return (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="py-4">
                      <div className="text-sm font-medium text-midnight-blue">
                        {product.code}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-midnight-blue">
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500">
                        {product.provider}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500">
                        {product.visibility}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500">
                        {product.linkedSmes}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500">
                        {product.linkedLoans}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`font-normal border text-xs ${
                          isActive
                            ? "border-green-500 text-green-500 bg-green-50"
                            : "border-red-500 text-red-500 bg-red-50"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary-green hover:text-primary-green hover:bg-green-50"
                          onClick={() => {
                            if (onEdit) {
                              onEdit(product.id);
                            } else {
                              router.push(`/loan-products/${product.id}/edit`);
                            }
                          }}
                          disabled={isBusy}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 ${
                            isActive
                              ? "text-yellow-600 hover:text-yellow-600 hover:bg-yellow-50"
                              : "text-yellow-600 hover:text-yellow-600 hover:bg-yellow-50"
                          }`}
                          onClick={() => {
                            if (onToggleStatus) {
                              onToggleStatus(
                                product.id,
                                isActive ? "inactive" : "active"
                              );
                            }
                          }}
                          disabled={isBusy}
                          title={isActive ? "Disable" : "Enable"}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
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

