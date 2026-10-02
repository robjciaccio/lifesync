import { StyleSheet, FlatList, View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useTransactions } from "@/hooks/useTransactions";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function TransactionsScreen() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactions();

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }
  const queryClient = useQueryClient();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);

      // Ask backend to pull new transactions from Plaid
      const response = await fetch(
        "http://localhost:3000/transactions/refresh",
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to refresh transactions");
      }

      // Reload transactions from our database
      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      // Spending calendar may have changed too
      await queryClient.invalidateQueries({
        queryKey: ["daily-spending"],
      });
    } catch (error) {
      console.error("Failed to refresh transactions:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.transactionCard,
          pressed && styles.transactionCardPressed,
        ]}
        onPress={() => {
          router.push({
            pathname: "/transactions/detail/[transactionId]",
            params: {
              transactionId: item.id,
              transactionName: item.merchantName ?? item.name,
              amount: item.amount.toString(),
              date: item.date,
              accountName: item.financialAccount?.name ?? "",
              transactionTypeId: item.transactionType?.id ?? "",
              transactionTypeName: item.transactionType?.name ?? "",
            },
          });
        }}
      >
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionName}>
            {item.merchantName ?? item.name}
          </Text>

          <Text style={styles.transactionDetails}>
            {item.financialAccount?.name}
          </Text>

          {item.transactionType && (
            <Text style={styles.transactionType}>
              {item.transactionType.name}
            </Text>
          )}
        </View>

        <Text style={styles.transactionAmount}>
          {formatCurrency(item.amount)}
        </Text>
      </Pressable>
    );
  };

  const transactions = data?.pages.flatMap((page) => page.transactions) ?? [];
  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#F9F9F9" }}
    >
      <View style={{}}>
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginTop: 30,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },
  transactionCardPressed: {
    opacity: 0.6,
  },

  transactionType: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.6,
  },

  transactionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },

  transactionDetails: {
    marginTop: 5,
    fontSize: 13,
    color: "#8A8A8E",
  },

  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },
});
