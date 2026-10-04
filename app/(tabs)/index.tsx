import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccounts } from "../../hooks/usePlaidAccounts";
import { refreshAccounts } from "../../api/refreshAccount";

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, isLoading, isError, error } = useAccounts();

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await refreshAccounts();

      await queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    } catch (error) {
      console.error("Failed to refresh accounts:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {isLoading && <Text style={styles.status}>Loading accounts...</Text>}

      {isError && (
        <Text style={styles.error}>
          Failed to load accounts: {error.message}
        </Text>
      )}

      <View style={styles.accounts}>
        {data?.accounts?.map((account: any) => (
          <Pressable
            key={account.id}
            style={({ pressed }) => [
              styles.accountCard,
              pressed && styles.accountCardPressed,
            ]}
            onPress={() => {
              router.push({
                pathname: "/accounts/[accountId]",
                params: {
                  accountId: account.id,
                  accountName: account.name,
                  itemId: account.plaidItem.itemId,
                },
              });
            }}
          >
            <View>
              <Text style={styles.accountName}>{account.name}</Text>

              <Text style={styles.accountDetails}>
                {account.subtype} •••• {account.mask}
              </Text>
            </View>

            <Text style={styles.balance}>
              {formatCurrency(account.currentBalance)}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  accountCardPressed: {
    opacity: 0.6,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111111",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#737373",
  },
  status: {
    marginTop: 24,
    color: "#737373",
  },

  error: {
    marginTop: 24,
    color: "#B42318",
  },

  accounts: {
    marginTop: 28,
    gap: 12,
  },

  accountCard: {
    backgroundColor: "purple",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  accountName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111111",
  },

  accountDetails: {
    marginTop: 5,
    fontSize: 13,
    color: "#8A8A8E",
    textTransform: "capitalize",
  },

  balance: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111111",
  },
});
