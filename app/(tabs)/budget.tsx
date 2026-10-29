import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useCreateCategory } from "@/hooks/useCreateCategory";

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
  const createCategory = useCreateCategory();

  const sortedCategories = data?.spendingByType.sort(
    (a, b) => (b.monthlyBudget ?? 0) - (a.monthlyBudget ?? 0),
  );

  const handleNewCategory = () => {
    Alert.prompt(
      "New Category",
      "Enter the name of the new category",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Create",
          onPress: async (value: any) => {
            const name = value.trim();

            if (!name) {
              Alert.alert("Invalid name", "Category name cannot be empty.");

              return;
            }

            try {
              await createCategory.mutateAsync(name);
            } catch (error) {
              console.error("Failed to create category:", error);
            }
          },
        },
      ],
      "plain-text",
    );
  };

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
        {/* <ThemedText style={{ color: "white" }} type="title">
          Budget
        </ThemedText> */}

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <ThemedText
            style={{
              color: "white",
              marginLeft: "auto",
              fontSize: 14,
              paddingLeft: 40,
            }}
          >
            SPENT
          </ThemedText>
          <ThemedText
            style={{
              color: "white",
              marginLeft: "auto",

              fontSize: 14,
            }}
          >
            BUDGET
          </ThemedText>
        </View>

        <View style={styles.categories}>
          {sortedCategories?.map((cat) => (
            <Pressable
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => handleSetBudget(cat)}
            >
              <ThemedText style={styles.categoryText}>{cat.name}</ThemedText>

              <ThemedText style={styles.spentText}>
                {formatCurrency(cat.spent)}
              </ThemedText>

              <ThemedText style={styles.budgetText}>
                {cat.monthlyBudget !== null
                  ? `${formatCurrency(cat.monthlyBudget)}`
                  : "$0"}
              </ThemedText>
            </Pressable>
          ))}

          <Pressable
            style={({ pressed }) => [
              styles.categoryCard,
              pressed && styles.categoryCardPressed,
            ]}
            onPress={handleNewCategory}
          >
            <ThemedText style={{ color: "white" }}>Add Category</ThemedText>
          </Pressable>
          {/* </View> */}
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
    backgroundColor: "#191970",
  },
  categoryCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 20,
    position: "relative",
  },

  categoryText: {
    color: "white",
    fontSize: 14,
    maxWidth: "40%",
  },

  spentText: {
    color: "white",
    fontSize: 14,
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -25 }],
  },

  budgetText: {
    color: "white",
    fontSize: 14,
    marginLeft: "auto",
    textAlign: "right",
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
    color: "white",
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
    color: "white",
  },

  summaryCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#663399",
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
    color: "white",
  },

  summaryLabel: {
    fontSize: 14,
    opacity: 0.6,
    color: "white",
  },

  sectionTitle: {
    marginTop: 32,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    left: 0,
  },

  categories: {
    gap: 12,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },

  transactionCount: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.55,
    color: "white",
  },

  categoryAmount: {
    fontSize: 17,
    fontWeight: "700",
    color: "white",
  },
});
