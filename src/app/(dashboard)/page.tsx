import Image from "next/image";
import "@/lib/calculations/stats";
import {
  computeGlobalStats,
  formatAsDaysHoursMinutes,
  formatAsHoursMinutes,
  formatAsMinutes,
} from "@/lib/calculations/stats";
import { loadLocalCalendars } from "@/lib/calculations/load-local-calendars";

export default function Home() {
  const events = loadLocalCalendars([
    { id: "fitness", fileName: "fitness.ics" },
    { id: "career", fileName: "career.ics" },
  ]);

  const stats = computeGlobalStats(events);

  const timeDaysHoursMinutes = formatAsDaysHoursMinutes(stats.totalMinutes);
  const timeHoursMinutes = formatAsHoursMinutes(stats.totalMinutes);
  const timeMinutes = formatAsMinutes(stats.totalMinutes);
  console.log("Dashboard Stats:", stats);
  console.log("Time Formats: ", timeDaysHoursMinutes, timeHoursMinutes, timeMinutes);




  return (
    //background
    <div className="min-h-screen bg-[color:var(--page-bg)] bg-blobs">
      <main className="mx-auto min-h-screen max-w-[1280px] flex-col gap-12 px-8 py-12">
        {/* Page header */}
        <section className="min-h-[80px]"></section>
        
        {/* Main content */}
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
      </main>

    </div>
  );
}
