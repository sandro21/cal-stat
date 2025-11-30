"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatAsCompactHoursMinutes } from "@/lib/calculations/stats";

interface PieChartData {
  name: string;
  value: number;
}

interface ActivityPieChartProps {
  data: PieChartData[];
}

const COLORS = [
  "var(--red-1)",
  "var(--red-2)",
  "var(--red-3)",
  "var(--red-4)",
  "var(--red-5)",
  "gray", // For "Other"
];

export function ActivityPieChart({ data }: ActivityPieChartProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            labelLine={true}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatAsCompactHoursMinutes(value)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

