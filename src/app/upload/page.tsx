"use client";

import { UploadCalendar } from "@/components/UploadCalendar";
import { CalendarEvent } from "@/lib/calculations/stats";

export default function UploadPage() {
  const handleUploadComplete = (newEvents: CalendarEvent[]) => {
    // Events are now stored in localStorage and will be loaded by EventsContext
    // Navigation happens in UploadCalendar component
  };

  return (
    <main className="h-90% flex flex-col items-center justify-center px-18">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-5xl font-bold text-black mb-4 text-center">
          Upload Your Calendar(s)
        </h1>
        <p className="text-2xl text-[color:var(--gray)] mb-8 text-center">
          Import calendars to get started
        </p>
        
        <UploadCalendar onUploadComplete={handleUploadComplete} />
      </div>
    </main>
  );
}

