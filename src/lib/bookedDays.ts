// Reads the public "Boarding availability" Google Calendar and returns the
// days that have any event on them, as "YYYY-MM-DD" strings in the site's time zone.
//
// Events marked "Free" in Google Calendar (transparency) are ignored, so the
// owner can keep notes on the calendar without blocking a day.

interface CalendarEvent {
  status?: string;
  transparency?: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
}

/** "YYYY-MM-DD" for an instant, as seen in the given time zone. */
export function dayKey(date: Date, timeZone: string): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

/** Adds days to a "YYYY-MM-DD" key. */
export function addDays(key: string, days: number): string {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** First and last day (inclusive) an event covers. */
function eventDays(event: CalendarEvent, timeZone: string): [string, string] {
  if (event.start.date && event.end.date) {
    // All-day event: the end date is exclusive.
    return [event.start.date, addDays(event.end.date, -1)];
  }
  const start = new Date(event.start.dateTime!);
  const end = new Date(new Date(event.end.dateTime!).getTime() - 1);
  return [dayKey(start, timeZone), dayKey(end, timeZone)];
}

export async function fetchBookedDays(opts: {
  calendarId: string;
  apiKey: string;
  timeZone: string;
  from: Date;
  to: Date;
}): Promise<Set<string>> {
  const params = new URLSearchParams({
    key: opts.apiKey,
    timeMin: opts.from.toISOString(),
    timeMax: opts.to.toISOString(),
    singleEvents: 'true', // expand repeating events
    maxResults: '2500',
    fields: 'items(status,transparency,start,end)', // never download event titles
  });
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(opts.calendarId)}/events?${params}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Google Calendar returned ${response.status}`);
  const { items = [] } = (await response.json()) as { items?: CalendarEvent[] };

  const booked = new Set<string>();
  for (const event of items) {
    if (event.status === 'cancelled' || event.transparency === 'transparent') continue;
    const [first, last] = eventDays(event, opts.timeZone);
    for (let day = first; day <= last; day = addDays(day, 1)) booked.add(day);
  }
  return booked;
}
