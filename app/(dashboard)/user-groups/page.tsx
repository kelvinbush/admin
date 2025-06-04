"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Header from "./_components/header";
import EmptyState from "./_components/empty-state";
import { NewUserGroupModal } from "./_components/new-user-group-modal";
import { EditUserGroupModal } from "./_components/edit-user-group-modal";
import { UserGroupsTable, UserGroup } from "./_components/user-groups-table";
import { DeleteUserGroupModal } from "./_components/delete-user-group-modal";
import { toast } from "sonner";

export default function UserGroupsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserGroup, setSelectedUserGroup] = useState<UserGroup | null>(null);

  // Sample data based on the image
  const sampleUserGroups: UserGroup[] = [
    {
      id: "1",
      groupNo: "GRP-001",
      name: "Tuungane",
      productVisibility: ["All loan products"],
      linkedSMEs: 10,
      createdAt: "Jan 26, 2025",
      updatedAt: null,
    },
    {
      id: "2",
      groupNo: "GRP-002",
      name: "GIZ-SAIS",
      productVisibility: ["All loan products"],
      linkedSMEs: 2,
      createdAt: "Jan 26, 2025",
      updatedAt: "Jan 28, 2025",
    },
    {
      id: "3",
      groupNo: "GRP-003",
      name: "Elevate",
      productVisibility: ["Ecobank loans", "Absa loans"],
      linkedSMEs: 0,
      createdAt: "Jan 28, 2025",
      updatedAt: "Jan 31, 2025",
    },
    {
      id: "4",
      groupNo: "GRP-004",
      name: "Ecobank",
      productVisibility: ["Ecobank loans", "Absa loans"],
      linkedSMEs: 4,
      createdAt: "Jan 31, 2025",
      updatedAt: null,
    },
    {
      id: "5",
      groupNo: "GRP-005",
      name: "Absa",
      productVisibility: ["Absa loans", "Ecobank loans"],
      linkedSMEs: 5,
      createdAt: "Jan 31, 2025",
      updatedAt: "Feb 01, 2025",
    },
  ];

  // Filter user groups based on search query
  const filteredUserGroups = searchQuery
    ? sampleUserGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.groupNo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleUserGroups;

  const totalUserGroups = filteredUserGroups.length;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handleCreateUserGroup = (data: any) => {
    console.log("Creating user group:", data);
    toast.success("User group created successfully!");
    setIsNewModalOpen(false);
  };

  const handleEditUserGroup = (userGroup: UserGroup) => {
    setSelectedUserGroup(userGroup);
    setIsEditModalOpen(true);
  };
  
  const handleSaveEditedUserGroup = (data: any) => {
    console.log("Saving edited user group:", data);
    toast.success(`User group ${data.name} updated successfully!`);
    setIsEditModalOpen(false);
    // Here you would make an API call to update the user group
  };

  const handleDeleteUserGroup = (userGroup: UserGroup) => {
    setSelectedUserGroup(userGroup);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUserGroup = () => {
    if (selectedUserGroup) {
      console.log("Deleting user group:", selectedUserGroup);
      toast.success(`User group ${selectedUserGroup.name} deleted successfully!`);
      setIsDeleteModalOpen(false);
      // Here you would make an API call to delete the user group
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 bg-white px-4 rounded h-full flex-1 flex flex-col">
      <Header
        totalUserGroups={totalUserGroups}
        onSearch={handleSearch}
        onCreateClick={() => setIsNewModalOpen(true)}
      />

      <Separator />

      {totalUserGroups === 0 ? (
        <EmptyState onCreateClick={() => setIsNewModalOpen(true)} />
      ) : (
        <div className="mt-6">
          <UserGroupsTable
            userGroups={filteredUserGroups}
            onEdit={handleEditUserGroup}
            onDelete={handleDeleteUserGroup}
          />
        </div>
      )}

      <NewUserGroupModal
        open={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleCreateUserGroup}
      />
      
      <EditUserGroupModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEditedUserGroup}
        userGroup={selectedUserGroup}
      />

      <DeleteUserGroupModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteUserGroup}
        userGroup={selectedUserGroup}
      />
    </div>
  );
}
