import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTransactions } from "@/hooks/useTransactions";
import { ReconnectBankButton } from "@/components/ReconnectBankButton";

export default function AccountTransactionsScreen() {
  const { accountId, accountName, itemId } = useLocalSearchParams<{
    accountId: string;
    accountName?: string;
    itemId: string;
  }>();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactions({
    accountId,
  });

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
      <ThemedText type="title">{accountName ?? "Account"}</ThemedText>
      <ReconnectBankButton itemId={itemId} />
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
                {formatDate(item.date)}
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
            No transactions for this account.
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
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
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

  list: {
    paddingTop: 20,
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
