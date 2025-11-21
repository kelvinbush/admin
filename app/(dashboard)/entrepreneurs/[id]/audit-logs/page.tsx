"use client";

import { useState } from "react";
import { AuditTrailHeader } from "./_components/audit-trail-header";
import { AuditTrailTable, type AuditLogEntry } from "./_components/audit-trail-table";
import { AuditTrailPagination } from "./_components/audit-trail-pagination";

type SortOption = "date-asc" | "date-desc";
type FilterUser = "all" | string;

export default function AuditLogsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [filterUser, setFilterUser] = useState<FilterUser>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // TODO: Fetch audit logs and users from API
  // Placeholder data for testing
  const allEntries: AuditLogEntry[] = [
    {
      id: "1",
      changeSummary: "Updated Business Sector from 'Agriculture' to 'Retail'.",
      initiatedBy: {
        id: "user1",
        name: "Robert Mugabe",
        email: "robert.mugabe@gmail.com",
      },
      timestamp: "2025-10-11T16:15:45Z",
    },
    {
      id: "2",
      changeSummary: "Changed Legal Entity Type from 'Sole Proprietorship' to 'Private Limited Company'.",
      initiatedBy: {
        id: "user2",
        name: "Linet Adani",
        email: "linet.adani@gmail.com",
      },
      timestamp: "2025-10-12T17:30:12Z",
    },
    {
      id: "3",
      changeSummary: "Deleted uploaded document: 'Business Plan.docx'.",
      initiatedBy: {
        id: "user3",
        name: "Tracey Marie",
        email: "tracey.marie@gmail.com",
      },
      timestamp: "2025-10-13T18:45:33Z",
    },
    {
      id: "4",
      changeSummary: "Changed Bank Statement Name from 'Equity Bank' to 'KCB Bank'.",
      initiatedBy: {
        id: "user4",
        name: "Shem Minjire",
        email: "shem.minjire@gmail.com",
      },
      timestamp: "2025-10-14T19:00:29Z",
    },
    {
      id: "5",
      changeSummary: "Added new business photo: 'storefront.jpg'.",
      initiatedBy: {
        id: "user5",
        name: "Cecile Soul",
        email: "cecile.soul@gmail.com",
      },
      timestamp: "2025-10-15T20:15:11Z",
    },
    {
      id: "6",
      changeSummary: "Updated company website from 'https://old-site.com' to 'https://new-site.com'.",
      initiatedBy: {
        id: "user1",
        name: "Robert Mugabe",
        email: "robert.mugabe@gmail.com",
      },
      timestamp: "2025-10-16T09:20:00Z",
    },
    {
      id: "7",
      changeSummary: "Changed number of employees from '10-50' to '51-100'.",
      initiatedBy: {
        id: "user2",
        name: "Linet Adani",
        email: "linet.adani@gmail.com",
      },
      timestamp: "2025-10-17T10:30:15Z",
    },
    {
      id: "8",
      changeSummary: "Updated registered office address.",
      initiatedBy: {
        id: "user3",
        name: "Tracey Marie",
        email: "tracey.marie@gmail.com",
      },
      timestamp: "2025-10-18T11:45:22Z",
    },
    {
      id: "9",
      changeSummary: "Uploaded new financial statement for year 2024.",
      initiatedBy: {
        id: "user4",
        name: "Shem Minjire",
        email: "shem.minjire@gmail.com",
      },
      timestamp: "2025-10-19T12:00:30Z",
    },
    {
      id: "10",
      changeSummary: "Updated entrepreneur's date of birth.",
      initiatedBy: {
        id: "user5",
        name: "Cecile Soul",
        email: "cecile.soul@gmail.com",
      },
      timestamp: "2025-10-20T13:15:45Z",
    },
    {
      id: "11",
      changeSummary: "Changed company headquarters from 'Nairobi' to 'Mombasa'.",
      initiatedBy: {
        id: "user1",
        name: "Robert Mugabe",
        email: "robert.mugabe@gmail.com",
      },
      timestamp: "2025-10-21T14:20:10Z",
    },
    {
      id: "12",
      changeSummary: "Added new video link: 'https://youtube.com/watch?v=example'.",
      initiatedBy: {
        id: "user2",
        name: "Linet Adani",
        email: "linet.adani@gmail.com",
      },
      timestamp: "2025-10-22T15:30:25Z",
    },
    {
      id: "13",
      changeSummary: "Updated business description.",
      initiatedBy: {
        id: "user3",
        name: "Tracey Marie",
        email: "tracey.marie@gmail.com",
      },
      timestamp: "2025-10-23T16:45:40Z",
    },
    {
      id: "14",
      changeSummary: "Changed average monthly turnover from 'KES 500,000' to 'KES 750,000'.",
      initiatedBy: {
        id: "user4",
        name: "Shem Minjire",
        email: "shem.minjire@gmail.com",
      },
      timestamp: "2025-10-24T17:00:55Z",
    },
    {
      id: "15",
      changeSummary: "Uploaded new bank statement for 'Equity Bank'.",
      initiatedBy: {
        id: "user5",
        name: "Cecile Soul",
        email: "cecile.soul@gmail.com",
      },
      timestamp: "2025-10-25T18:15:10Z",
    },
    {
      id: "16",
      changeSummary: "Updated entrepreneur's position from 'CEO' to 'Managing Director'.",
      initiatedBy: {
        id: "user1",
        name: "Robert Mugabe",
        email: "robert.mugabe@gmail.com",
      },
      timestamp: "2025-10-26T19:20:25Z",
    },
    {
      id: "17",
      changeSummary: "Changed program/user group from 'Tuungane2xna Absa' to 'Tuungane2xna Standard'.",
      initiatedBy: {
        id: "user2",
        name: "Linet Adani",
        email: "linet.adani@gmail.com",
      },
      timestamp: "2025-10-27T20:30:40Z",
    },
    {
      id: "18",
      changeSummary: "Updated company tax identification number.",
      initiatedBy: {
        id: "user3",
        name: "Tracey Marie",
        email: "tracey.marie@gmail.com",
      },
      timestamp: "2025-10-28T21:45:55Z",
    },
    {
      id: "19",
      changeSummary: "Added new country of operation: 'Tanzania'.",
      initiatedBy: {
        id: "user4",
        name: "Shem Minjire",
        email: "shem.minjire@gmail.com",
      },
      timestamp: "2025-10-29T22:00:10Z",
    },
    {
      id: "20",
      changeSummary: "Updated entrepreneur's phone number.",
      initiatedBy: {
        id: "user5",
        name: "Cecile Soul",
        email: "cecile.soul@gmail.com",
      },
      timestamp: "2025-10-30T23:15:25Z",
    },
  ];

  // Extract unique users for filter dropdown
  const availableUsers = Array.from(
    new Map(
      allEntries.map((entry) => [
        entry.initiatedBy.id,
        {
          id: entry.initiatedBy.id,
          name: entry.initiatedBy.name,
          email: entry.initiatedBy.email,
        },
      ])
    ).values()
  );

  // Filter and sort entries
  const filteredEntries = allEntries.filter((entry) => {
    if (filterUser !== "all" && entry.initiatedBy.id !== filterUser) return false;
    if (searchValue && !entry.changeSummary.toLowerCase().includes(searchValue.toLowerCase())) return false;
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sort === "date-asc") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    if (sort === "date-desc") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-midnight-blue">Audit Trail</h1>

      {/* Header with Filters */}
      <AuditTrailHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onClearSearch={() => setSearchValue("")}
        sort={sort}
        onSortChange={setSort}
        filterUser={filterUser}
        onFilterChange={setFilterUser}
        availableUsers={availableUsers}
      />

      {/* Table */}
      <AuditTrailTable entries={paginatedEntries} />

      {/* Pagination */}
      {totalPages > 1 && (
        <AuditTrailPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedEntries.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
