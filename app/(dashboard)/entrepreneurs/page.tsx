"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  PlusIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Progress } from "@/components/ui/progress";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  bgColor: string;
  textColor?: string;
}

const StatCard = ({
  title,
  value,
  change,
  bgColor,
  textColor = "white",
}: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card
      className={`${bgColor} text-${textColor} shadow-md border-midnight-blue`}
    >
      <CardContent className="p-6">
        <h3 className="text-lg">{title}</h3>
        <div className="mt-2 items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          <span
            className={`flex mt-2 items-center text-sm ${isPositive ? "text-primary-green" : "text-primary-red"}`}
          >
            {isPositive ? (
              <div
                className={cn(
                  "p-[3px] rounded-full bg-primary-red",
                  isPositive && "bg-primary-green",
                )}
              >
                <ArrowUpIcon className="h-3.5 w-3.5 text-black transform rotate-45" />
              </div>
            ) : (
              <div
                className={cn(
                  "p-[3px] rounded-full bg-primary-red",
                  isPositive && "bg-primary-green",
                )}
              >
                <ArrowDownIcon className="h-3.5 w-3.5 text-black rotate-[315deg]" />
              </div>
            )}
            <div className={"mx-1"}>{Math.abs(change)}%</div>
            <span className={"text-white text-xs"}> From last month</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for the table
const tableData = [
  {
    id: 1,
    businessName: "DMA Limited",
    user: {
      name: "Robert Mugabe",
      email: "robert.mugabe@gmail.com",
      phone: "+255712345678",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    affiliate: "Tuungane2XnaAbsa",
    sector: "Agriculture, Technology",
    progress: 100
  },
  {
    id: 2,
    businessName: "Duhga",
    user: {
      name: "Linet Adani",
      email: "linet.adani@gmail.com",
      phone: "+254712345748",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    affiliate: "GIZ-SAIS",
    sector: "Real estate, Infrastructure",
    progress: 100
  },
  {
    id: 3,
    businessName: "Lineter Enterprise Ltd",
    user: {
      name: "Tracey Marie",
      email: "tracey.marie@gmail.com",
      phone: "+256775445678",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    affiliate: "GIZ-CGIAR",
    sector: "Energy, Technology",
    progress: 100
  },
  {
    id: 4,
    businessName: "Funke Science",
    user: {
      name: "Shem Minjire",
      email: "shem.minjire@gmail.com",
      phone: "+254712445678",
      image: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    affiliate: "Ecobank",
    sector: "Financial Services",
    progress: 100
  },
  {
    id: 5,
    businessName: "Cesha Investments Ltd",
    user: {
      name: "Cecile Soul",
      email: "cecile.soul@gmail.com",
      phone: "+254712345678",
      image: "https://randomuser.me/api/portraits/women/5.jpg"
    },
    affiliate: "Tuungane2XnaAbsa",
    sector: "Healthcare",
    progress: 100
  },
  {
    id: 6,
    businessName: "Farm2Feed",
    user: {
      name: "Soraya Ngure",
      email: "soraya.ngure@gmail.com",
      phone: "+254712448878",
      image: "https://randomuser.me/api/portraits/women/6.jpg"
    },
    affiliate: "GIZ-SAIS",
    sector: "Agriculture, Technology",
    progress: 100
  },
  {
    id: 7,
    businessName: "Luxe by Mulanda",
    user: {
      name: "Paul Lari",
      email: "paul.lari@gmail.com",
      phone: "+254775441238",
      image: "https://randomuser.me/api/portraits/men/7.jpg"
    },
    affiliate: "GIZ-CGIAR",
    sector: "Real estate, Infrastructure",
    progress: 100
  },
  {
    id: 8,
    businessName: "TechVision Solutions",
    user: {
      name: "Sarah Kimani",
      email: "sarah.kimani@gmail.com",
      phone: "+254712987654",
      image: "https://randomuser.me/api/portraits/women/8.jpg"
    },
    affiliate: "Ecobank",
    sector: "Technology, Innovation",
    progress: 85
  },
  {
    id: 9,
    businessName: "Green Earth Farms",
    user: {
      name: "James Omondi",
      email: "james.omondi@gmail.com",
      phone: "+254723456789",
      image: "https://randomuser.me/api/portraits/men/9.jpg"
    },
    affiliate: "GIZ-SAIS",
    sector: "Agriculture, Sustainability",
    progress: 75
  },
  {
    id: 10,
    businessName: "HealthFirst Clinic",
    user: {
      name: "Grace Njeri",
      email: "grace.njeri@gmail.com",
      phone: "+254734567890",
      image: "https://randomuser.me/api/portraits/women/10.jpg"
    },
    affiliate: "Tuungane2XnaAbsa",
    sector: "Healthcare, Technology",
    progress: 90
  },
  {
    id: 11,
    businessName: "EduTech Kenya",
    user: {
      name: "Daniel Mwangi",
      email: "daniel.mwangi@gmail.com",
      phone: "+254745678901",
      image: "https://randomuser.me/api/portraits/men/11.jpg"
    },
    affiliate: "GIZ-CGIAR",
    sector: "Education, Technology",
    progress: 65
  },
  {
    id: 12,
    businessName: "CleanEnergy Solutions",
    user: {
      name: "Faith Wanjiku",
      email: "faith.wanjiku@gmail.com",
      phone: "+254756789012",
      image: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    affiliate: "GIZ-SAIS",
    sector: "Energy, Sustainability",
    progress: 95
  }
];

const tabs = [
  { id: "all", label: "All SMEs" },
  { id: "complete", label: "Complete SME Profiles" },
  { id: "incomplete", label: "Incomplete SME Profiles" },
  { id: "verified", label: "Verified SME Profiles" },
  { id: "pending", label: "Profiles Pending Verification" },
];

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const stats = [
    {
      title: "Registered SMEs",
      value: "300",
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Complete Profiles",
      value: "100",
      change: -10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Incomplete Profiles",
      value: "200",
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Verified SMEs",
      value: "50",
      change: -10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Pending Verification",
      value: "50",
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
  ];

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Table Section */}
      <div className="flex flex-col space-y-4 bg-white shadow p-4 rounded">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-medium mr-auto">Entrepreneurs (300)</h2>
          {/* Search Input */}
          <div className="relative min-w-[160px]">
            <Input
              type="text"
              placeholder="Search entrepreneur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className={"w-max"}>
              <div className="flex items-center gap-2">Sort by</div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="ascending">A-Z</SelectItem>
              <SelectItem value="descending">Z-A</SelectItem>
            </SelectContent>
          </Select>

          {/* Hide Filters Button */}
          <Button
            variant="secondary"
            className="flex items-center gap-2 bg-[#E8E9EA]"
          >
            <FunnelIcon className="h-5 w-5" />
            Hide Filters
          </Button>

          {/* Download Button */}
          <Button
            variant="secondary"
            className="flex items-center gap-2 bg-[#E8E9EA]"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </Button>

          {/* New SME Button */}
          <Button className="bg-midnight-blue text-white hover:bg-midnight-blue/90 flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            New SME
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Select>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="AFFILIATE/PROGRAM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="affiliate1">Affiliate 1</SelectItem>
              <SelectItem value="affiliate2">Affiliate 2</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="SECTOR" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sector1">Sector 1</SelectItem>
              <SelectItem value="sector2">Sector 2</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="VERIFICATION STATUS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="B/S PROFILE PROGRESS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-[#00B67C] text-white hover:bg-[#00B67C]/90">
            APPLY
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === tab.id
                    ? "border-[#00B67C] text-[#00B67C]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affiliate/Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  B/S Sector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  B/S Profile Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.businessName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={item.user.image}
                        alt={item.user.name}
                        className="h-8 w-8 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.user.email} | {item.user.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.affiliate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.sector}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Progress value={item.progress} className="w-24" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center text-sm text-gray-700">
            Showing 1 to {itemsPerPage} of {tableData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
