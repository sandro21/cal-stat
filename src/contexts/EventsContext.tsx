"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { CalendarEvent } from "@/lib/calculations/stats";
import { parseIcsToEventsBrowser } from "@/lib/calculations/parse-ics-browser";

interface EventsContextType {
  events: CalendarEvent[];
  refreshEvents: () => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ 
  children
}: { 
  children: ReactNode;
}) {
  const [uploadedEvents, setUploadedEvents] = useState<CalendarEvent[]>([]);

  const loadUploadedCalendars = () => {
    if (typeof window === 'undefined') return [];
    
    try {
      const storedCalendars = JSON.parse(localStorage.getItem('uploadedCalendars') || '[]');
      const allEvents: CalendarEvent[] = [];
      
      for (const calendar of storedCalendars) {
        const events = parseIcsToEventsBrowser(calendar.icsText, calendar.id);
        allEvents.push(...events);
      }
      
      return allEvents;
    } catch (error) {
      console.error('Error loading uploaded calendars:', error);
      return [];
    }
  };

  useEffect(() => {
    const loaded = loadUploadedCalendars();
    setUploadedEvents(loaded);
  }, []);

  const refreshEvents = () => {
    const loaded = loadUploadedCalendars();
    setUploadedEvents(loaded);
  };

  return (
    <EventsContext.Provider value={{ events: uploadedEvents, refreshEvents }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}

