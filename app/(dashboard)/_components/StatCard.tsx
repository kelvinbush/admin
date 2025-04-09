import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  bgColor = "bg-midnight-blue",
  textColor = "text-white",
}: StatCardProps) => {
  return (
    <Card className={cn(bgColor, textColor, "shadow-md")}>
      <CardContent className="p-6">
        <h3 className="text-lg">{title}</h3>
        <div className="mt-2">
          <span className="text-2xl font-bold">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
