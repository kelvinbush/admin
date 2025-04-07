import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SMELoanGrowthProps {
  year: number;
}

// Sample data based on the chart in the image
const chartData2025 = [
  { month: "Jan", smeRegistrations: 20, loanApplications: 100 },
  { month: "Feb", smeRegistrations: 70, loanApplications: 150 },
  { month: "Mar", smeRegistrations: 130, loanApplications: 50 },
  { month: "Apr", smeRegistrations: 170, loanApplications: 10 },
  { month: "May", smeRegistrations: 200, loanApplications: 100 },
  { month: "Jun", smeRegistrations: 230, loanApplications: 280 },
  { month: "Jul", smeRegistrations: 350, loanApplications: 100 },
  { month: "Aug", smeRegistrations: 150, loanApplications: 100 },
  { month: "Sep", smeRegistrations: 300, loanApplications: 400 },
  { month: "Oct", smeRegistrations: 400, loanApplications: 320 },
  { month: "Nov", smeRegistrations: 45, loanApplications: 250 },
  { month: "Dec", smeRegistrations: 300, loanApplications: 158 },
];

const chartData2024 = [
  { month: "Jan", smeRegistrations: 15, loanApplications: 80 },
  { month: "Feb", smeRegistrations: 60, loanApplications: 130 },
  { month: "Mar", smeRegistrations: 110, loanApplications: 40 },
  { month: "Apr", smeRegistrations: 150, loanApplications: 20 },
  { month: "May", smeRegistrations: 180, loanApplications: 90 },
  { month: "Jun", smeRegistrations: 210, loanApplications: 250 },
  { month: "Jul", smeRegistrations: 320, loanApplications: 90 },
  { month: "Aug", smeRegistrations: 130, loanApplications: 90 },
  { month: "Sep", smeRegistrations: 280, loanApplications: 380 },
  { month: "Oct", smeRegistrations: 380, loanApplications: 300 },
  { month: "Nov", smeRegistrations: 35, loanApplications: 230 },
  { month: "Dec", smeRegistrations: 280, loanApplications: 140 },
];

const SMELoanGrowth: React.FC<SMELoanGrowthProps> = ({ year }) => {
  const [selectedYear, setSelectedYear] = useState(year);
  const [showMenu, setShowMenu] = useState(false);
  
  const chartData = selectedYear === 2025 ? chartData2025 : chartData2024;

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  return (
    <Card className="w-full mt-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">SME & Loan Growth Trends</h3>
          <div className="flex items-center gap-2">
            <select 
              className="border rounded-md p-1 text-sm"
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
            <div className="relative">
              <button 
                className="text-gray-500"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical size={20} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    View in full screen
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Print chart
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Download image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="smeRegistrations"
                name="SME registrations"
                stroke="#ec4899"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="loanApplications"
                name="Loan applications"
                stroke="#10b981"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span className="text-sm">SME registrations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm">Loan Applications</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GeneralOverview = () => {
  return (
    <div className="space-y-6">
      <SMELoanGrowth year={2025} />
    </div>
  );
};

export default GeneralOverview;
