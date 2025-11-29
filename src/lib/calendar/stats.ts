export interface CalendarEvent {
    id: string;
    calendarId: string;   // which .ics file / source it came from
    title: string;        // activity name
  
    start: Date;
    end: Date;
  
    durationMinutes: number; // derived: (end - start) in minutes
    dayOfWeek: number;       // 0–6 (Sun–Sat)
    dayString: string;       // "YYYY-MM-DD"
    isAllDay: boolean;
  }


export interface GlobalStats {
    totalCount: number;
    uniqueActivities: number;
    totalMinutes: number;
}

//calculates total count, unique activity count, and total minutes.
    export function computeGlobalStats(events: CalendarEvent[]): GlobalStats {
        const totalCount = events.length;
        const uniqueTitles = new Set(events.map(event => event?.title));
        const uniqueActivities = uniqueTitles.size;

        const totalMinutes = events.reduce(
            (sum, event) => sum + event?.durationMinutes,
            0
        );

        return {
            totalCount,
            uniqueActivities,
            totalMinutes,
        }
    }



//////////////////////////////////////////////////////

//Calculates days, hours, and minutes from total minutes
    export interface TimeBreakdown {
        days: number;
        hours: number;
        minutes: number;
    }

    export function breakdownMinutes(totalMinutes: number): TimeBreakdown {
        const minutesInDay = 24 * 60;
        const minutesInHour = 60;

        const days = Math.floor(totalMinutes / minutesInDay);
        const remainingAfterDays = totalMinutes % minutesInDay;

        const hours = Math.floor(remainingAfterDays / minutesInHour);
        const minutes = remainingAfterDays % minutesInHour;

        return {
            days,
            hours,
            minutes,
        }
    }


//formatting the time breakdown into a string 
    //Days, Hours, Minutes
    export function formatAsDaysHoursMinutes(totalMinutes: number): string {
        const {days, hours, minutes} = breakdownMinutes(totalMinutes);

        return `${days} Day${days === 1 ? '' : 's'}, ${hours} Hour${hours === 1 ? '' : 's'}, ${minutes} Minute${minutes === 1 ? '' : 's'}`;
    }

    //Hours, Minutes
    export function formatAsHoursMinutes(totalMinutes: number): string {
        const {days, hours, minutes} = breakdownMinutes(totalMinutes); 
            const totalHours = days * 24 + hours;
            return `${totalHours} Hour${totalHours !== 1 ? "s" : ""}, ${minutes} Minute${minutes !== 1 ? "s" : ""}`;
    }

    //Minutes
    export function formatAsMinutes(totalMinutes: number): string {
            return `${totalMinutes} Minute${totalMinutes !== 1 ? "s" : ""}`;
    }

