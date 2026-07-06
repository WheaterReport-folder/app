import RNCalendarEvents, { CalendarEventReadable } from 'react-native-calendar-events';

export async function requestCalendarPermission(): Promise<boolean> {
  const status = await RNCalendarEvents.requestPermissions();
  return status === 'authorized';
}

export async function fetchUpcomingEvents(
  daysAhead: number = 90,
): Promise<CalendarEventReadable[]> {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + daysAhead);

  return RNCalendarEvents.fetchAllEvents(
    start.toISOString(),
    end.toISOString(),
  );
}

export async function debugCalendars() {
  const calendars = await RNCalendarEvents.findCalendars();
  console.log('찾은 캘린더 개수:', calendars.length);
  console.log('캘린더 목록:', JSON.stringify(calendars, null, 2));
}