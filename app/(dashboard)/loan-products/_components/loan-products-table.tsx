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
}

export function LoanProductsTable({
  data,
  onRowClick,
  onAddProduct,
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
              <TableRow className="bg-primaryGrey-50 p-4">
                <TableHead className="w-[220px] font-medium text-primaryGrey-500">
                  PRODUCT NAME
                </TableHead>
                <TableHead className=" font-medium text-midnight-blue">
                  STATUS
                </TableHead>
                <TableHead className="font-medium text-midnight-blue">
                  AMOUNT RANGE
                </TableHead>
                <TableHead className="font-medium text-midnight-blue">
                  TERM
                </TableHead>
                <TableHead className="font-medium text-midnight-blue">
                  INTEREST RATE
                </TableHead>
                <TableHead className="font-medium text-midnight-blue">
                  CREATED
                </TableHead>
                <TableHead className="font-medium text-midnight-blue">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow className={"p-4"}>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="text-center">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No loan products found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Get started by creating your first loan product
                      </p>
                      <Button
                        className="bg-[#00B67C] hover:bg-[#00B67C]/90"
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
                    className="hover:bg-gray-50 cursor-pointer p-4"
                    onClick={() => onRowClick(product)}
                  >
                    <TableCell>
                      <div className="font-medium text-midnight-blue">
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-light text-xs ${
                          product.isActive
                            ? "border-green-200 text-green-700"
                            : "border-red-200 text-red-700"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {formatCurrency(product.minAmount, product.currency)}
                        </div>
                        <div className="text-gray-500">
                          to{" "}
                          {formatCurrency(product.maxAmount, product.currency)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatTerm(
                          product.minTerm,
                          product.maxTerm,
                          product.termUnit,
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium text-[#00B67C]">
                          {product.interestRate}%
                        </div>
                        <div className="text-gray-500">
                          {product.interestType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
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
                          <DropdownMenuItem onClick={() => onRowClick(product)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
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
