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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  DollarSign,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { LoanProduct } from "@/lib/api/types";

interface LoanProductsTableProps {
  data: LoanProduct[];
  onRowClick: (product: LoanProduct) => void;
  onAddProduct: () => void;
  onViewProduct: (product: LoanProduct) => void;
}

export function LoanProductsTable({
  data,
  onRowClick,
  onAddProduct,
  onViewProduct,
}: LoanProductsTableProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTerm = (minTerm: number, maxTerm: number, termUnit: string) => {
    const unit = termUnit.toLowerCase();
    if (minTerm === maxTerm) {
      return `${minTerm} ${unit}`;
    }
    return `${minTerm} - ${maxTerm} ${unit}`;
  };

  return (
    <Card className={"shadow-none"}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className={""}>
              <TableRow className="bg-primaryGrey-50">
                <TableHead className="w-[220px] font-medium text-primaryGrey-500 py-4">
                  PRODUCT NAME
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  STATUS
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  AMOUNT RANGE
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  TERM
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  INTEREST RATE
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  CREATED
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow className={"p-4"}>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="text-center">
                      <DollarSign className="h-12 w-12 text-primaryGrey-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-midnight-blue mb-2">
                        No loan products found
                      </h3>
                      <p className="text-primaryGrey-400 mb-6">
                        Get started by creating your first loan product
                      </p>
                       <Button
                         className="bg-primary-green hover:bg-primary-green/90"
                         onClick={onAddProduct}
                       >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Product
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((product: LoanProduct) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onRowClick(product)}
                  >
                    <TableCell className="py-4">
                      <div className="font-medium text-midnight-blue">
                        {product.name}
                      </div>
                    </TableCell>
                     <TableCell className="py-4">
                       <Badge
                         variant="outline"
                         className={`font-normal border text-xs ${
                           product.status === 'active'
                             ? "border-green-500 text-green-500"
                             : product.status === 'draft'
                             ? "border-yellow-500 text-yellow-500"
                             : "border-red-500 text-red-500"
                         }`}
                       >
                         {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                       </Badge>
                     </TableCell>
                     <TableCell className="py-4">
                       <div className="text-sm">
                         <div>
                           {formatCurrency(product.minAmount, product.currency)}
                         </div>
                         <div className="text-primaryGrey-400">
                           to{" "}
                           {formatCurrency(product.maxAmount, product.currency)}
                         </div>
                       </div>
                     </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm">
                        {formatTerm(
                          product.minTerm,
                          product.maxTerm,
                          product.termUnit,
                        )}
                      </div>
                    </TableCell>
                     <TableCell className="py-4">
                       <div className="text-sm">
                         <div className="font-medium text-primary-green">
                           {product.interestRate}%
                         </div>
                         <div className="text-primaryGrey-400">
                           {product.interestType}
                         </div>
                       </div>
                     </TableCell>
                     <TableCell className="py-4">
                       <div className="text-sm text-primaryGrey-400">
                         {new Date(product.createdAt).toLocaleDateString()}
                       </div>
                     </TableCell>
                    <TableCell
                      className="py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewProduct(product)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Quick View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onRowClick(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
