import Image from "next/image";
import "@/lib/calculations/stats";
import {
  computeGlobalStats,
  computeTopActivities,
  formatAsDaysHoursMinutes,
  formatAsHoursMinutes,
  formatAsMinutes,
  formatAsCompactHoursMinutes,
} from "@/lib/calculations/stats";
import { loadLocalCalendars } from "@/lib/calculations/load-local-calendars";
import { ActivityPieChart } from "@/components/ActivityPieChart";

export default function Home() {
  const events = loadLocalCalendars([
    { id: "fitness", fileName: "fitness.ics" },
    { id: "career", fileName: "career.ics" },
  ]);

  const stats = computeGlobalStats(events);
  const topActivities = computeTopActivities(events, "time", 5);

  // Calculate "Other" category (all activities not in top 5)
  const top5TotalMinutes = topActivities.reduce((sum, activity) => sum + activity.totalMinutes, 0);
  const otherMinutes = stats.totalMinutes - top5TotalMinutes;

  // Prepare pie chart data
  const pieChartData = [
    ...topActivities.map((activity) => ({
      name: activity.name,
      value: activity.totalMinutes,
    })),
    ...(otherMinutes > 0 ? [{ name: "Other", value: otherMinutes }] : []),
  ];

  const timeDaysHoursMinutes = formatAsDaysHoursMinutes(stats.totalMinutes);
  const timeHoursMinutes = formatAsHoursMinutes(stats.totalMinutes);
  const timeMinutes = formatAsMinutes(stats.totalMinutes);
  console.log("Dashboard Stats:", stats);
  console.log("Time Formats: ", timeDaysHoursMinutes, timeHoursMinutes, timeMinutes);




  return (
    //background
    <div className="min-h-screen bg-[color:var(--page-bg)] bg-blobs">
      <main className="mx-auto min-h-screen flex-col gap-18 px-18 py-12">
        {/* Page header */}
        <section className="min-h-[80px]"></section>
        
        {/* All Loging Details Class */}
        <section className="space-y-[60px]">
        <section className="space-y-[40px]">

          {/* header */}
          <h2 className="text-section-header text-black mb-4">
            All Logging Details
          </h2>

          {/* grid of cards */}
          <div className="grid grid-cols-[200px_200px_1fr] auto-rows-[200px] gap-3">
            {/* Total Activities */}
            <div className="card-soft flex flex-col items-center justify-center text-center px-6">
              <h3 className="text-card-title text-black">Total Activities</h3>
              <div className="mt-4 text-number-large text-[color:var(--red-1)]">
                {stats.totalCount}
              </div>
            </div>

            {/* Different Activities */}
            <div className="card-soft flex flex-col items-center justify-center text-center px-6">
              <h3 className="text-card-title text-black">Different Activities</h3>
              <div className="mt-4 text-number-large text-[color:var(--red-1)]">
                {stats.uniqueActivities}
              </div>
            </div>

            {/* Right big card – chart placeholder for now */}
            <div className="card-soft row-span-2 flex flex-col px-8 py-6">
              <h3 className="text-card-title text-black mb-4">Logging Progress</h3>
              <p className="text-body-24 text-[color:var(--gray)]">
                [Line chart placeholder for total minutes over time]
              </p>
            </div>

            {/* Time Logged */}
            <div className="card-soft col-span-2 flex flex-col items-center justify-center text-center px-8">
              <h3 className="text-card-title text-black mb-2">Time Logged</h3>
              <p className="text-body-24 text-[color:var(--red-1)]">
                {timeDaysHoursMinutes}
              </p>
              <p className="text-body-24 text-[color:var(--red-2)]">
                {timeHoursMinutes}
              </p>
              <p className="text-body-24 text-black">
                {timeMinutes}
          </p>
        </div>
        </div>
        </section>



        {/* Top Activities */}
        <section className="space-y-[40px]">

          {/* header */}
          <h2 className="text-section-header text-black mb-4">
           Top Activities
          </h2>

          {/* grid of cards */}
          <div className="grid grid-cols-[3fr_1fr] auto-rows-[300px] gap-3">
            
            {/* Top Activities Table */}
            <div className="card-soft flex flex-col px-8 py-4 text-left">
              <div className="flex-1 overflow-hidden">
                <table className="table-fixed w-full">
                  <thead>
                    <tr className="border-b border-[color:var(--gray)]/20 text-left">
                      <th className="pb-1 text-left text-body-24 text-[color:var(--gray)] w-[33%] pr-4">Name</th>
                      <th className="pb-1 text-left text-body-24 text-[color:var(--gray)] w-[20%] pr-4">Duration</th>
                      <th className="pb-1 text-left text-body-24 text-[color:var(--gray)] w-[15%] pr-4">Count</th>
                      <th className="pb-1 text-left text-body-24 text-[color:var(--gray)] w-[18%] pr-4">Avg</th>
                      <th className="pb-1 text-left text-body-24 text-[color:var(--gray)] w-[%]">Longest</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topActivities.map((activity, index) => {
                      const redColors = [
                        'text-[color:var(--red-1)]',
                        'text-[color:var(--red-2)]',
                        'text-[color:var(--red-3)]',
                        'text-[color:var(--red-4)]',
                        'text-[color:var(--red-5)]',
                      ];
                      const rowColor = redColors[index] || 'text-[color:var(--red-5)]';
                      
                      return (
                        <tr key={activity.name} className="text-body-24 border-b border-[color:var(--gray)]/10 last:border-0 text-left">
                          <td className={`py-2 text-body-24 font-semibold pr-4 truncate text-left ${rowColor}`} title={activity.name}>
                            {activity.name}
                          </td>
                          <td className={`py-2 text-body-24 text-left ${rowColor}`}>
                            {formatAsCompactHoursMinutes(activity.totalMinutes)}
                          </td>
                          <td className={`py-2 text-body-24 text-left ${rowColor}`}>
                            {activity.count}
                          </td>
                          <td className={`py-2 text-body-24 text-left ${rowColor}`}>
                            {formatAsCompactHoursMinutes(activity.averageSessionMinutes)}
                          </td>
                          <td className={`py-2 text-body-24 text-left ${rowColor}`}>
                            {formatAsCompactHoursMinutes(activity.longestSessionMinutes)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="card-soft flex flex-col">
              <ActivityPieChart data={pieChartData} />
            </div>

            {/* Bottom element spanning 2 columns */}
            <div className="card-soft col-span-2 flex flex-col items-center justify-center text-center px-6">
              <h3 className="text-card-title text-black">Placeholder</h3>
            </div>
          </div>
        </section>

        {/* Habits */}
        <section className="space-y-[40px]">

          {/* header */}
          <h2 className="text-section-header text-black mb-4">
            Habits
          </h2>

          {/* grid of cards */}
          <div className="grid grid-cols-[2fr_1fr] auto-rows-[200px] gap-3">
            
            {/* Left side - Top card */}
            <div className="card-soft">
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <h3 className="text-card-title text-black">Placeholder</h3>
              </div>
            </div>

            {/* Right side - Square card spanning 2 rows */}
            <div className="card-soft row-span-2">
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <h3 className="text-card-title text-black">Placeholder</h3>
              </div>
            </div>

            {/* Left side - Bottom card */}
            <div className="card-soft">
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <h3 className="text-card-title text-black">Placeholder</h3>
              </div>
            </div>

          </div>
        </section>
        </section>
        
      </main>

    </div>
  );
}
