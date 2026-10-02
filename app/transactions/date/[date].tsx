import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTransactions } from "@/hooks/useTransactions";

export default function DailyTransactionsScreen() {
  const { date } = useLocalSearchParams<{
    date: string;
  }>();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactions({ date });

  const transactions = data?.pages.flatMap((page) => page.transactions) ?? [];

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Failed to load transactions.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Transactions</ThemedText>

      <ThemedText style={styles.date}>{formatDate(date)}</ThemedText>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View style={styles.transactionInfo}>
              <ThemedText style={styles.transactionName}>
                {item.merchantName ?? item.name}
              </ThemedText>

              <ThemedText style={styles.transactionDetails}>
                {item.financialAccount?.name}

                {item.financialAccount?.mask
                  ? ` •••• ${item.financialAccount.mask}`
                  : ""}
              </ThemedText>
            </View>

            <ThemedText style={styles.transactionAmount}>
              {formatCurrency(item.amount)}
            </ThemedText>
          </View>
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>
            No transactions for this day.
          </ThemedText>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.loadingMore} />
          ) : null
        }
      />
    </ThemedView>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  date: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 16,
    opacity: 0.6,
  },

  list: {
    paddingBottom: 40,
  },

  transactionCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },

  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },

  transactionName: {
    fontSize: 16,
    fontWeight: "600",
  },

  transactionDetails: {
    marginTop: 5,
    fontSize: 13,
    opacity: 0.6,
  },

  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    marginTop: 60,
    opacity: 0.6,
  },

  loadingMore: {
    marginVertical: 20,
  },
});
