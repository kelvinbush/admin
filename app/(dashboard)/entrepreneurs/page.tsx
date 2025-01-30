import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card className={`${bgColor} text-${textColor} shadow-md`}>
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

const Page = () => {
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

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Page;
