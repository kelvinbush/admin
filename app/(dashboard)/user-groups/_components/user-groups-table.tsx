"use client";

import { Edit, Trash2 } from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface UserGroup {
  id: string;
  groupNo: string;
  name: string;
  productVisibility: string[];
  linkedSMEs: number;
  createdAt: string;
  updatedAt: string | null;
}

interface UserGroupsTableProps {
  userGroups: UserGroup[];
  onEdit: (userGroup: UserGroup) => void;
  onDelete: (userGroup: UserGroup) => void;
}

export function UserGroupsTable({
  userGroups,
  onEdit,
  onDelete,
}: UserGroupsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-[100px] font-medium">GROUP NO</TableHead>
            <TableHead className="font-medium">NAME</TableHead>
            <TableHead className="font-medium">PRODUCT VISIBILITY</TableHead>
            <TableHead className="font-medium">LINKED SME(S)</TableHead>
            <TableHead className="font-medium">CREATED AT</TableHead>
            <TableHead className="font-medium">UPDATED AT</TableHead>
            <TableHead className="text-right font-medium">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userGroups.map((group) => (
            <TableRow
              key={group.id}
              className="group hover:bg-[#F0FFF9] transition-colors"
            >
              <TableCell className="font-medium">{group.groupNo}</TableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell>
                {group.productVisibility.map((product, index) => (
                  <div key={index}>{product}</div>
                ))}
              </TableCell>
              <TableCell>{group.linkedSMEs}</TableCell>
              <TableCell>{group.createdAt}</TableCell>
              <TableCell>{group.updatedAt || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-500"
                          onClick={() => onEdit(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit user group</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => onDelete(group)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete user group</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
