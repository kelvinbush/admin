import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Sample data based on the chart in the image
const registrationData2025 = [
  { month: "Jan", smeRegistrations: 20 },
  { month: "Feb", smeRegistrations: 70 },
  {
    month: "Mar",
    smeRegistrations: 170,
  },
  { month: "Apr", smeRegistrations: 180 },
  { month: "May", smeRegistrations: 200 },
  {
    month: "Jun",
    smeRegistrations: 230,
  },
  { month: "Jul", smeRegistrations: 350 },
  { month: "Aug", smeRegistrations: 100 },
  {
    month: "Sep",
    smeRegistrations: 300,
  },
  { month: "Oct", smeRegistrations: 400 },
  { month: "Nov", smeRegistrations: 45 },
  { month: "Dec", smeRegistrations: 300 },
];

const registrationData2024 = [
  { month: "Jan", smeRegistrations: 15 },
  { month: "Feb", smeRegistrations: 60 },
  {
    month: "Mar",
    smeRegistrations: 150,
  },
  { month: "Apr", smeRegistrations: 160 },
  { month: "May", smeRegistrations: 180 },
  {
    month: "Jun",
    smeRegistrations: 210,
  },
  { month: "Jul", smeRegistrations: 320 },
  { month: "Aug", smeRegistrations: 90 },
  {
    month: "Sep",
    smeRegistrations: 280,
  },
  { month: "Oct", smeRegistrations: 380 },
  { month: "Nov", smeRegistrations: 35 },
  { month: "Dec", smeRegistrations: 280 },
];

interface MonthlyRegistrationTrendProps {
  year: number;
}

const MonthlyRegistrationTrend: React.FC<MonthlyRegistrationTrendProps> = ({
  year,
}) => {
  const [selectedYear, setSelectedYear] = React.useState(year);
  const [showMenu, setShowMenu] = React.useState(false);

  const chartData =
    selectedYear === 2025 ? registrationData2025 : registrationData2024;

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-semibold">{label}</p>
          <p className="text-pink-500">
            <span className="font-semibold">SME registrations:</span>{" "}
            {payload[0].value}
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
          <h3 className="text-xl font-semibold">Monthly Registration Trend</h3>
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
                <linearGradient
                  id="colorRegistrations"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="smeRegistrations"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#colorRegistrations)"
                activeDot={{ r: 8 }}
              />

              {/* Display February annotation */}
              {selectedYear === 2025 && (
                <g>
                  <text
                    x={110}
                    y={150}
                    fill="#333"
                    fontWeight="bold"
                    fontSize="14"
                  >
                    February
                  </text>
                  <text x={110} y={170} fill="#666" fontSize="12">
                    SME registrations: 70
                  </text>
                </g>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span className="text-sm">SME registrations</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SMEAnalytics = () => {
  return (
    <div className="space-y-6">
      <MonthlyRegistrationTrend year={2025} />
    </div>
  );
};

export default SMEAnalytics;
