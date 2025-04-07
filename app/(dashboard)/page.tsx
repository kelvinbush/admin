"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "./_components/StatCard";
import GeneralOverview from "./_components/GeneralOverview";
import SMEAnalytics from "./_components/SMEAnalytics";
import LoanAnalytics from "./_components/LoanAnalytics";

const Page = () => {
  const stats = [
    {
      title: "Total Registered SMEs",
      value: "300",
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Total Loan Applications",
      value: "100",
      change: -10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Total Disbursed Amount",
      value: "€100,000",
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Avg. Loan Requested",
      value: "€10,000",
      change: -10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Avg. Profile Completion",
      value: "76%",
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white border-b">
          <TabsTrigger
            value="general"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
          >
            General Overview
          </TabsTrigger>
          <TabsTrigger
            value="sme"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
          >
            SME Analytics
          </TabsTrigger>
          <TabsTrigger
            value="loan"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
          >
            Loan Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6">
          <GeneralOverview />
        </TabsContent>
        <TabsContent value="sme" className="mt-6">
          <SMEAnalytics />
        </TabsContent>
        <TabsContent value="loan" className="mt-6">
          <LoanAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
