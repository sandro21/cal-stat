"use client";

import { CalendarEvent } from "@/lib/calculations/stats";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatAsCompactHoursMinutes } from "@/lib/calculations/stats";

interface TimeLoggedChartProps {
  events: CalendarEvent[];
}

// Manual month formatting to avoid hydration errors
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatMonth = (month: number): string => {
  return MONTH_NAMES[month] || '';
};

interface ChartDataPoint {
  date: string;
  minutes: number;
  dateObj: Date;
  monthLabel?: string;
}

export function TimeLoggedChart({ events }: TimeLoggedChartProps) {
  // Group events by week and calculate total minutes per week
  const chartData = useMemo(() => {
    if (events.length === 0) {
      return [];
    }

    // Helper function to get week start date (Monday)
    const getWeekStart = (date: Date): Date => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      return new Date(d.setDate(diff));
    };

    // Helper function to format week key (YYYY-MM-DD of week start)
    const getWeekKey = (date: Date): string => {
      const weekStart = getWeekStart(date);
      const year = weekStart.getFullYear();
      const month = String(weekStart.getMonth() + 1).padStart(2, "0");
      const day = String(weekStart.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Group by week
    const eventsByWeek = new Map<string, number>();
    events.forEach((event) => {
      const weekKey = getWeekKey(event.start);
      const currentMinutes = eventsByWeek.get(weekKey) || 0;
      eventsByWeek.set(weekKey, currentMinutes + event.durationMinutes);
    });

    // Find the date range
    const allDates = events.map(e => e.start);
    if (allDates.length === 0) return [];
    
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Get the week start for the first and last dates
    const firstWeekStart = getWeekStart(minDate);
    const lastWeekStart = getWeekStart(maxDate);
    
    // Generate all weeks in the range (including weeks with no events)
    const allWeeks: string[] = [];
    const currentWeek = new Date(firstWeekStart);
    
    while (currentWeek <= lastWeekStart) {
      const weekKey = getWeekKey(currentWeek);
      allWeeks.push(weekKey);
      // Move to next week (add 7 days)
      currentWeek.setDate(currentWeek.getDate() + 7);
    }
    
    // Create data points for all weeks, filling in missing ones with 0
    const data: ChartDataPoint[] = allWeeks.map((weekKey, index) => {
      const [year, month, day] = weekKey.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      
      // Check if this is first week of month - compare with previous week
      let isFirstWeekOfMonth = false;
      if (index === 0) {
        isFirstWeekOfMonth = true;
      } else {
        const prevWeekKey = allWeeks[index - 1];
        const [prevYear, prevMonth] = prevWeekKey.split('-').map(Number);
        // Check if month or year changed (month is 1-12 from string)
        if (prevMonth !== month || prevYear !== year) {
          isFirstWeekOfMonth = true;
        }
      }
      
      // month is 1-12, formatMonth expects 0-11
      const monthLabel = isFirstWeekOfMonth ? formatMonth(month - 1) : '';
      
      return {
        date: weekKey,
        minutes: eventsByWeek.get(weekKey) || 0, // 0 if no events in this week
        dateObj,
        monthLabel,
      };
    });

    return data;
  }, [events]);

  // Calculate number of unique months
  const uniqueMonths = useMemo(() => {
    const months = new Set<string>();
    chartData.forEach(d => {
      if (d.monthLabel) {
        months.add(d.monthLabel);
      }
    });
    return months.size;
  }, [chartData]);

  // Custom tick component that only renders when there's a label
  const CustomTick = ({ x, y, payload }: any) => {
    const dataPoint = chartData.find(d => d.date === payload.value);
    const label = dataPoint?.monthLabel || '';
    
    if (!label) return null;
    
    return (
      <text
        x={x}
        y={y + 15}
        fill="#3B3C40"
        fontSize={12}
        textAnchor="middle"
      >
        {label}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, coordinate }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (!coordinate) return null;
      
      return (
        <div 
          className="bg-white/70 backdrop-blur-sm border border-gray-200/30 rounded-xl p-2 shadow-lg"
          style={{
            position: 'absolute',
            left: `${coordinate.x - 170}px`,
            top: `${coordinate.y - 60}px`,
            pointerEvents: 'none',
            minWidth: '160px',
          }}
        >
          <p className="text-sm font-semibold text-black">
            Week of {(() => {
              const [year, month, day] = data.date.split('-').map(Number);
              return `${formatMonth(month - 1)} ${day}, ${year}`;
            })()}
          </p>
          <p className="text-sm text-[color:var(--red-1)]">
            {formatAsCompactHoursMinutes(data.minutes)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[color:var(--gray)]">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} style={{ position: 'relative' }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={<CustomTick />}
            stroke="#3B3C40"
            style={{ fontSize: '12px' }}
            interval={0}
          />
          <YAxis
            stroke="#3B3C40"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => formatAsCompactHoursMinutes(value)}
            width={50}
            tick={{ fontSize: 12 }}
            axisLine={false}
          />
          <Tooltip 
            content={<CustomTooltip />}
            position={{ x: 0, y: 0 }}
            allowEscapeViewBox={{ x: true, y: true }}
          />
          <Area
            type="monotone"
            dataKey="minutes"
            stroke="var(--red-1)"
            fill="var(--red-1)"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: "var(--red-1)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

