import { useCallback, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import type { CalendarEventReadable } from 'react-native-calendar-events';
import {
  debugCalendars,
  fetchUpcomingEvents,
  requestCalendarPermission,
} from '../calendar/calendarService';

function CalendarScreen() {
  const [events, setEvents] = useState<CalendarEventReadable[]>([]);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const load = useCallback(async () => {
    const granted = await requestCalendarPermission();
    if (!granted) {
      setPermissionDenied(true);
      return;
    }
    await debugCalendars();
    const upcoming = await fetchUpcomingEvents();
    console.log('가져온 일정 개수:', upcoming.length);
    setEvents(upcoming);
  }, []);

  return (
    <View style={styles.container}>
      <Button title="캘린더 불러오기" onPress={load} />
      {permissionDenied && <Text>캘린더 접근 권한이 필요합니다.</Text>}
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>{item.startDate}</Text>
            {!!item.location && <Text style={styles.meta}>{item.location}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  item: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  title: { fontWeight: '700', fontSize: 15 },
  meta: { color: '#555', marginTop: 2 },
});

export default CalendarScreen;