import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  bgColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
}

const StatCard = ({
  title,
  value,
  change,
  bgColor = "bg-midnight-blue",
  textColor = "text-white",
  icon,
}: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card className={cn(bgColor, textColor, "shadow-md")}>
      <CardContent className="p-6">
        <h3 className="text-lg">{title}</h3>
        <div className="mt-2">
          <span className="text-2xl font-bold">{value}</span>
          <span
            className={`flex mt-2 items-center text-sm`}
          >
            {isPositive ? (
              <div
                className={cn(
                  "p-[3px] rounded-full",
                  isPositive ? "bg-primary-green" : "bg-primary-red",
                )}
              >
                <ArrowUpIcon className="h-3.5 w-3.5 text-black transform rotate-45" />
              </div>
            ) : (
              <div
                className={cn(
                  "p-[3px] rounded-full",
                  isPositive ? "bg-primary-green" : "bg-primary-red",
                )}
              >
                <ArrowDownIcon className="h-3.5 w-3.5 text-black rotate-[315deg]" />
              </div>
            )}
            <div className="mx-1">{Math.abs(change)}%</div>
            <span className="text-xs"> From last month</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
