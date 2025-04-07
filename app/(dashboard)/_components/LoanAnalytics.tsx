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
  Area,
  AreaChart,
} from "recharts";

// Sample data based on the chart in the image
const loanApplicationData2025 = [
  { month: "Jan", loanApplications: 100 },
  { month: "Feb", loanApplications: 150 },
  { month: "Mar", loanApplications: 50 },
  { month: "Apr", loanApplications: 10 },
  { month: "May", loanApplications: 200 },
  { month: "Jun", loanApplications: 280 },
  { month: "Jul", loanApplications: 100 },
  { month: "Aug", loanApplications: 150 },
  { month: "Sep", loanApplications: 400 },
  { month: "Oct", loanApplications: 320 },
  { month: "Nov", loanApplications: 250 },
  { month: "Dec", loanApplications: 158 },
];

const loanApplicationData2024 = [
  { month: "Jan", loanApplications: 80 },
  { month: "Feb", loanApplications: 130 },
  { month: "Mar", loanApplications: 40 },
  { month: "Apr", loanApplications: 5 },
  { month: "May", loanApplications: 180 },
  { month: "Jun", loanApplications: 250 },
  { month: "Jul", loanApplications: 90 },
  { month: "Aug", loanApplications: 130 },
  { month: "Sep", loanApplications: 380 },
  { month: "Oct", loanApplications: 300 },
  { month: "Nov", loanApplications: 230 },
  { month: "Dec", loanApplications: 140 },
];

interface MonthlyLoanApplicationTrendProps {
  year: number;
}

const MonthlyLoanApplicationTrend: React.FC<MonthlyLoanApplicationTrendProps> = ({ year }) => {
  const [selectedYear, setSelectedYear] = useState(year);
  const [showMenu, setShowMenu] = useState(false);
  
  const chartData = selectedYear === 2025 ? loanApplicationData2025 : loanApplicationData2024;

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-semibold">{label}</p>
          <p className="text-emerald-500">
            <span className="font-semibold">Loan applications:</span> {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Monthly Loan Application Trend</h3>
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
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="colorLoanApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="loanApplications" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorLoanApplications)" 
                activeDot={{ r: 8 }}
              />
              
              {/* Display February annotation */}
              {selectedYear === 2025 && (
                <g>
                  <text x={110} y={150} fill="#333" fontWeight="bold" fontSize="14">
                    February
                  </text>
                  <text x={110} y={170} fill="#666" fontSize="12">
                    Loan applications: 150
                  </text>
                </g>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm">Loan applications</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LoanAnalytics = () => {
  return (
    <div className="space-y-6">
      <MonthlyLoanApplicationTrend year={2025} />
    </div>
  );
};

export default LoanAnalytics;
