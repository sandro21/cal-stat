import fs from "fs";
import path from "path";
import { parseIcsToEvents } from "./src/lib/calendar/parse-ics";
import {
  computeGlobalStats,
  formatAsDaysHoursMinutes,
  formatAsHoursMinutes,
  formatAsMinutes,
} from "./src/lib/calendar/stats";
import { loadLocalCalendars } from "./src/lib/calendar/load-local-calendars";

async function main() {
  const events = loadLocalCalendars([
    { id: "fitness", fileName: "fitness.ics" },
    { id: "career", fileName: "career.ics" },
  ]);

  console.log("Total events:", events.length);
  console.log("First event:", events[0]);

  const stats = computeGlobalStats(events);
  console.log("Global stats:", stats);
  console.log("Days/Hours/Minutes:", formatAsDaysHoursMinutes(stats.totalMinutes));
  console.log("Hours/Minutes:", formatAsHoursMinutes(stats.totalMinutes));
  console.log("Minutes:", formatAsMinutes(stats.totalMinutes));
}

// Actually run the script
main().catch((err) => {
  console.error(err);
  process.exit(1);
});