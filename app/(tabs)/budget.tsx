import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { useUpdateTransactionTypeBudget } from "@/hooks/useUpdateTransactionTypeBudget";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSpendingByType } from "@/hooks/useSpendingByType";

export default function BudgetScreen() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data, isLoading, error } = useSpendingByType(year, month);

  const totalSpent =
    data?.spendingByType.reduce((total, type) => total + type.spent, 0) ?? 0;

  const totalBudget =
    data?.spendingByType.reduce(
      (total, type) => total + (type.monthlyBudget ?? 0),
      0,
    ) ?? 0;

  const updateBudget = useUpdateTransactionTypeBudget();

  const handleSetBudget = (type: {
    id: string;
    name: string;
    monthlyBudget: number | null;
  }) => {
    Alert.prompt(
      `${type.name} Budget`,
      "Enter your monthly budget",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: async (value: any) => {
            const budget = Number(value);

            if (!Number.isFinite(budget) || budget < 0) {
              Alert.alert("Invalid budget", "Enter a valid dollar amount.");

              return;
            }

            try {
              await updateBudget.mutateAsync({
                transactionTypeId: type.id,
                monthlyBudget: budget,
              });
            } catch (error) {
              console.error("Failed to update budget:", error);

              Alert.alert("Error", "Unable to update the budget.");
            }
          },
        },
      ],
      "plain-text",
      type.monthlyBudget?.toString() ?? "",
      "decimal-pad",
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Failed to load spending.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Budget</ThemedText>

        <ThemedText style={styles.month}>
          {new Date(year, month - 1).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </ThemedText>

        <View style={styles.summaryCard}>
          <View style={styles.summaryColumn}>
            <ThemedText style={styles.summaryLabel}>Total spent</ThemedText>

            <ThemedText style={styles.summaryAmount}>
              {formatCurrency(totalSpent)}
            </ThemedText>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryColumn}>
            <ThemedText style={styles.summaryLabel}>Total budget</ThemedText>

            <ThemedText style={styles.summaryAmount}>
              {formatCurrency(totalBudget)}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.sectionTitle}>
          Spending by category
        </ThemedText>

        <View style={styles.categories}>
          {data?.spendingByType.map((type) => (
            <Pressable
              key={type.id}
              style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.categoryCardPressed,
              ]}
              onPress={() => handleSetBudget(type)}
            >
              <View>
                <ThemedText style={styles.categoryName}>{type.name}</ThemedText>

                <ThemedText style={styles.transactionCount}>
                  {type.transactionCount}{" "}
                  {type.transactionCount === 1 ? "transaction" : "transactions"}
                </ThemedText>
              </View>

              <View style={styles.amountContainer}>
                <ThemedText style={styles.categoryAmount}>
                  {formatCurrency(type.spent)}
                </ThemedText>

                <ThemedText style={styles.budgetAmount}>
                  {type.monthlyBudget !== null
                    ? `of ${formatCurrency(type.monthlyBudget)}`
                    : "Set budget"}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  categoryCardPressed: {
    opacity: 0.6,
  },
  amountContainer: {
    alignItems: "flex-end",
  },

  budgetAmount: {
    marginTop: 3,
    fontSize: 12,
    opacity: 0.5,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  month: {
    marginTop: 4,
    fontSize: 16,
    opacity: 0.6,
  },

  summaryCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    flexDirection: "row",
    alignItems: "center",
  },
  summaryColumn: {
    flex: 1,
  },

  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 16,
  },

  summaryAmount: {
    marginTop: 6,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700",
  },

  summaryLabel: {
    fontSize: 14,
    opacity: 0.6,
  },

  sectionTitle: {
    marginTop: 32,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "700",
  },

  categories: {
    gap: 12,
  },

  categoryCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categoryName: {
    fontSize: 16,
    fontWeight: "600",
  },

  transactionCount: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.55,
  },

  categoryAmount: {
    fontSize: 17,
    fontWeight: "700",
  },
});
