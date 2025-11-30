import {
  computeActivityStats,
  formatAsCompactHoursMinutes,
  formatAsDaysHoursMinutes,
  formatAsHoursMinutes,
  formatAsMinutes,
} from "@/lib/calculations/stats";
import { loadLocalCalendars } from "@/lib/calculations/load-local-calendars";
import { ContributionsCalendar } from "@/components/ContributionsCalendar";

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
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

  return (
    <div className="min-h-screen bg-[color:var(--page-bg)] bg-blobs">
      <main className="mx-auto flex flex-col gap-12 px-18 py-12">
        {/* Section 1 Header */}
        <section>
          <h2 className="text-section-header text-black">
            Viewing <span className="font-bold italic">{activityStats.name}</span> Statistics of <span className="font-bold italic text-[color:var(--red-1)]">{timeFilter}</span>
          </h2>

          {/* grid of cards */}
          <div className="grid grid-cols-[1fr_2fr_3.5fr] auto-rows-[200px] gap-3">
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

            {/* 3. Top right - Placeholder (spans 1 col, 3.5fr, spans 2 rows) */}
            <div className="card-soft row-span-2 px-8 py-6">
              <h3 className="text-card-title mb-4">Placeholder</h3>
              <p className="text-body-24 text-[color:var(--gray)]">
                [Placeholder]
              </p>
            </div>

            {/* 4. Bottom - Placeholder (spans 2 cols = 1fr + 2fr = 3fr) */}
            <div className="card-soft col-span-2">
              <h3 className="text-card-title">Placeholder</h3>
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
            {/* 1. Placeholder (spans 2 rows, left column) */}
            <div className="card-soft row-span-2">
              <h3 className="text-card-title">Placeholder</h3>
            </div>

            {/* 2. Average (spans 1 col, 1 row, middle column) */}
            <div className="card-soft">
              <h3 className="text-card-title">Average</h3>
              <div className="text-number-medium text-[color:var(--red-1)]">
                {formatAsCompactHoursMinutes(activityStats.averageSessionMinutes)}
              </div>
            </div>

            {/* 3. Placeholder (spans 2 rows, right column) */}
            <div className="card-soft row-span-2">
              <h3 className="text-card-title">Placeholder</h3>
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
          <div className="grid grid-cols-[1fr_1fr_1fr] auto-rows-[200px] gap-3">
            {/* Prevalent Days */}
            <div className="card-soft">
              <h3 className="text-card-title">Prevalent Days</h3>
              <div className="mt-4 text-body-24 text-[color:var(--gray)]">
                [Placeholder]
              </div>
            </div>

            {/* Time of Day */}
            <div className="card-soft">
              <h3 className="text-card-title">Time of Day</h3>
              <div className="mt-4 text-body-24 text-[color:var(--gray)]">
                [Placeholder]
              </div>
            </div>

            {/* Peak Month */}
            <div className="card-soft">
              <h3 className="text-card-title">Peak Month</h3>
              <div className="mt-4 text-body-24 text-[color:var(--gray)]">
                [Placeholder]
              </div>
            </div>
          </div>
        </section>

        {/* Graph Section */}
        <section>
          <h2 className="text-section-header text-black">
            Trends
          </h2>

          {/* grid of cards */}
          <div className="grid grid-cols-[1fr] auto-rows-[400px] gap-3">
            {/* Line Chart */}
            <div className="card-soft px-8 py-6">
              <h3 className="text-card-title mb-4">Activity Over Time</h3>
              <p className="text-body-24 text-[color:var(--gray)]">
                [Line chart placeholder]
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

