import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useDailySpending } from "@/hooks/useDailySpending";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarScreen() {
  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data, isLoading } = useDailySpending(year, month);

  const days = getCalendarDays(year, month);

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));

  const goToPreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((current) => current - 1);
      return;
    }

    setMonth((current) => current - 1);
  };

  const goToNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((current) => current + 1);
      return;
    }

    setMonth((current) => current + 1);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Calendar</ThemedText>

      <View style={styles.calendarCard}>
        <View style={styles.header}>
          <Pressable onPress={goToPreviousMonth} style={styles.arrowButton}>
            <ThemedText style={styles.arrow}>‹</ThemedText>
          </Pressable>

          <ThemedText style={styles.month}>{monthName}</ThemedText>

          <Pressable onPress={goToNextMonth} style={styles.arrowButton}>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </Pressable>
        </View>

        <View style={styles.week}>
          {WEEKDAYS.map((day, index) => (
            <ThemedText key={`${day}-${index}`} style={styles.weekday}>
              {day}
            </ThemedText>
          ))}
        </View>

        <View style={styles.calendar}>
          {days.map((day, index) => {
            if (!day) {
              return <View key={`empty-${index}`} style={styles.day} />;
            }

            const dateKey = `${year}-${String(month).padStart(
              2,
              "0",
            )}-${String(day).padStart(2, "0")}`;

            const amount = data?.spendingByDay?.[dateKey] ?? 0;

            return (
              <Pressable
                key={dateKey}
                style={({ pressed }) => [
                  styles.day,
                  pressed && styles.dayPressed,
                ]}
                onPress={() => {
                  router.push({
                    pathname: "/transactions/date/[date]",
                    params: {
                      date: dateKey,
                    },
                  });
                }}
              >
                <ThemedText style={styles.dayNumber}>{day}</ThemedText>

                {!isLoading && amount > 0 && (
                  <ThemedText style={styles.amount}>
                    ${formatAmount(amount)}
                  </ThemedText>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </ThemedView>
  );
}

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay();

  const numberOfDays = new Date(year, month, 0).getDate();

  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= numberOfDays; day++) {
    days.push(day);
  }

  return days;
}

function formatAmount(amount: number) {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k`;
  }

  return Math.round(amount).toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 24,
  },

  calendarCard: {
    borderRadius: 20,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  month: {
    fontSize: 20,
    fontWeight: "700",
  },
  dayPressed: {
    opacity: 0.5,
  },
  arrowButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  arrow: {
    fontSize: 32,
  },

  week: {
    flexDirection: "row",
    marginBottom: 8,
  },

  weekday: {
    width: "14.2857%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.6,
  },

  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  day: {
    width: "14.2857%",
    minHeight: 62,
    alignItems: "center",
    paddingTop: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 10,

    margin: "0.5%",
  },

  dayNumber: {
    fontSize: 15,
    fontWeight: "500",
  },

  amount: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.7,
  },
});
