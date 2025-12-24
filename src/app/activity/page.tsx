import {
  computeActivityStats,
  formatAsCompactHoursMinutes,
  formatAsDaysHoursMinutes,
  formatAsHoursMinutes,
  formatAsMinutes,
} from "@/lib/calculations/stats";
import { loadLocalCalendars } from "@/lib/calculations/load-local-calendars";
import { ContributionsCalendar } from "@/components/ContributionsCalendar";
import { ActivityDayOfWeekChart } from "@/components/ActivityDayOfWeekChart";
import { TimeLoggedChart } from "@/components/TimeLoggedChart";
import { ActivityDurationChart } from "@/components/ActivityDurationChart";
import { ActivityScatterLineChart } from "@/components/ActivityScatterLineChart";
import { TimeOfDayChart } from "@/components/TimeOfDayChart";
import { ActivityPeakMonthChart } from "@/components/ActivityPeakMonthChart";

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatDateTime(date: Date): string {
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }).toLowerCase();
  return `${month} ${day},${year} ${time}`;
}

export default function ActivityPage() {
  // For now, using a placeholder activity name
  // Later this will come from URL params or search
  const searchString = "workout"; // Placeholder
  const timeFilter = "All Time"; // Placeholder
  
  const events = loadLocalCalendars([
    { id: "fitness", fileName: "fitness.ics" },
    { id: "career", fileName: "career.ics" },
  ]);

  const activityStats = computeActivityStats(events, searchString);
  
  // Filter events for the contributions calendar
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchString.toLowerCase())
  );

  const timeDaysHoursMinutes = formatAsDaysHoursMinutes(activityStats.totalMinutes);
  const timeHoursMinutes = formatAsHoursMinutes(activityStats.totalMinutes);
  const timeMinutes = formatAsMinutes(activityStats.totalMinutes);

  // Get first and last session events for the table
  const sortedFilteredEvents = [...filteredEvents].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
  const firstSessionEvent = sortedFilteredEvents[0] || null;
  const lastSessionEvent = sortedFilteredEvents[sortedFilteredEvents.length - 1] || null;

  return (
    <div className="min-h-screen bg-[color:var(--page-bg)] bg-blobs">
      <main className="mx-auto flex flex-col gap-12 px-18 py-12">
        {/* Section 1 Header */}
        <section>
          <h2 className="text-section-header text-black">
            Viewing <span className="font-bold italic">{activityStats.name}</span> Statistics of <span className="font-bold italic text-[color:var(--red-1)]">{timeFilter}</span>
          </h2>

          {/* grid of cards */}
          <div className="grid grid-cols-[0.9fr_1.9fr_3.5fr] auto-rows-[200px] gap-3">
            {/* 1. Top left - Total Count (spans 1 col, 1fr) */}
            <div className="card-soft">
              <h3 className="text-card-title">Total Count</h3>
              <div className="text-number-large text-[color:var(--red-1)]">
                {activityStats.totalCount}
              </div>
            </div>

            {/* 2. Top middle - Time Logged (spans 1 col, 2fr) */}
            <div className="card-soft col-span-1 px-8">
              <h3 className="text-card-title mb-2">Time Logged</h3>
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

            {/* 3. Top right - Time Logged Line Chart (spans 1 col, 3.5fr, spans 2 rows) */}
            <div className="card-soft row-span-2 flex flex-col px-8 py-6">
              <h3 className="text-card-title mb-4">Time Logged</h3>
              <div className="flex-1 min-h-0 w-full">
                <TimeLoggedChart events={filteredEvents} />
              </div>
            </div>

            {/* 4. Bottom - First/Last Session Table (spans 2 cols = 1fr + 2fr = 3fr) */}
            <div className="card-soft col-span-2 px-8 py-6">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-body-24 pb-3 w-[140px]"></th>
                    <th className=" text-body-24 pb-3 w-[240px]">Start Time</th>
                    <th className="text-body-24 pb-3">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-body-24 text-black pb-3 w-[170px]">First Session</td>
                    <td className="text-body-24 text-[color:var(--red-1)] pb-3 w-[240px]">
                      {firstSessionEvent ? formatDateTime(firstSessionEvent.start) : "N/A"}
                    </td>
                    <td className="text-body-24 text-[color:var(--red-1)] pb-3">
                      {firstSessionEvent ? formatAsCompactHoursMinutes(firstSessionEvent.durationMinutes) : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-body-24 text-black w-[170px]">Last Session</td>
                    <td className="text-body-24 text-[color:var(--red-1)] w-[240px]">
                      {lastSessionEvent ? formatDateTime(lastSessionEvent.start) : "N/A"}
                    </td>
                    <td className="text-body-24 text-[color:var(--red-1)]">
                      {lastSessionEvent ? formatAsCompactHoursMinutes(lastSessionEvent.durationMinutes) : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Session Durations Section */}
        <section>
          <h2 className="text-section-header">
            Session Durations
          </h2>

          {/* grid of cards */}
          <div className="grid grid-cols-[1.5fr_1fr_2fr] auto-rows-[150px] gap-3">
            {/* 1. Activity Duration Chart (spans 2 rows, left column) */}
            <div className="card-soft row-span-2 flex flex-col px-3 py-3">
              <h3 className="text-card-title mb-4">Activity Duration</h3>
              <div className="flex-1 min-h-0 w-full">
                <ActivityDurationChart events={filteredEvents} />
              </div>
            </div>

            {/* 2. Average (spans 1 col, 1 row, middle column) */}
            <div className="card-soft">
              <h3 className="text-card-title">Average</h3>
              <div className="text-number-medium text-[color:var(--red-1)]">
                {formatAsCompactHoursMinutes(activityStats.averageSessionMinutes)}
              </div>
            </div>

            {/* 3. Activity Scatter Line Chart (spans 2 rows, right column) */}
            <div className="card-soft row-span-2 flex flex-col px-3 py-3">
              <h3 className="text-card-title mb-4">Activity Distribution</h3>
              <div className="flex-1 min-h-0 w-full">
                <ActivityScatterLineChart events={filteredEvents} />
              </div>
            </div>

            {/* 4. Longest (spans 1 col, 1 row, middle column, under Average) */}
            <div className="card-soft gap-0">
              <h3 className="text-card-title">Longest</h3>
              <div className="text-number-medium text-[color:var(--red-1)]">
                {activityStats.longestSession 
                  ? formatAsCompactHoursMinutes(activityStats.longestSession.minutes)
                  : "N/A"}
              </div>
              {activityStats.longestSession && (
                <p className="text-date">
                  on {formatDate(activityStats.longestSession.date)}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Consistency Section */}
        <section>
          <h2 className="text-section-header">
            Consistency
          </h2>

          {/* grid of cards */}
          <div className="grid grid-cols-[1.5fr_1.5fr_3fr] grid-rows-[250px_160px] gap-3">
            {/* GitHub Style Contributions Calendar (spans all 3 columns) */}
            <div className="card-soft col-span-3">
              <ContributionsCalendar events={filteredEvents} />
            </div>

            {/* Longest Streak */}
            <div className="card-soft">
              <h3 className="text-card-title">Longest Streak</h3>
              <div className="text-number-medium text-[color:var(--red-1)]">
                {activityStats.longestStreak 
                  ? `${activityStats.longestStreak.days} days`
                  : "N/A"}
              </div>
              {activityStats.longestStreak && (
                <p className="text-date">
                  {formatDate(activityStats.longestStreak.from)} - {formatDate(activityStats.longestStreak.to)}
                </p>
              )}
            </div>

            {/* Biggest Break */}
            <div className="card-soft">
              <h3 className="text-card-title">Biggest Break</h3>
              <div className="text-number-medium text-[color:var(--red-1)]">
                {activityStats.biggestBreak 
                  ? `${activityStats.biggestBreak.days} days`
                  : "N/A"}
              </div>
              {activityStats.biggestBreak && (
                <p className="text-date">
                  {formatDate(activityStats.biggestBreak.from)} - {formatDate(activityStats.biggestBreak.to)}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Habits Section */}
        <section>
          <h2 className="text-section-header text-black">
            Habits
          </h2>

          {/* grid of cards */}
          <div className="grid grid-cols-[2fr_400px] auto-rows-[400px] gap-3">
            {/* Prevalent Days */}
            <div className="card-soft flex flex-col px-6 py-4">
              <h3 className="text-card-title mb-2">Prevalent Days</h3>
              <div className="flex-1 min-h-0 w-full">
                <ActivityDayOfWeekChart events={filteredEvents} />
              </div>
            </div>

            {/* Time of Day */}
            <div className="card-soft flex flex-col px-8 py-6">
              <h3 className="text-card-title mb-4">Time of Day</h3>
              <div className="flex-1 min-h-0 w-full">
                <TimeOfDayChart events={filteredEvents} />
              </div>
            </div>

            {/* Peak Month */}
            <div className="card-soft col-span-2 flex flex-col px-6 py-4">
              <h3 className="text-card-title mb-2">Peak Month</h3>
              <div className="flex-1 min-h-0 w-full">
                <ActivityPeakMonthChart events={filteredEvents} />
              </div>
            </div>
          </div>
        </section>


      </main>
    </div>
  );
}

