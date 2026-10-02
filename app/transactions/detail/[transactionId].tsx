import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTransactionTypes } from "@/hooks/useTransactionTypes";
import { useUpdateTransactionType } from "@/hooks/useUpdateTransactionTypes";

export default function TransactionDetailScreen() {
  const {
    transactionId,
    transactionName,
    amount,
    date,
    accountName,
    transactionTypeId,
  } = useLocalSearchParams<{
    transactionId: string;
    transactionName: string;
    amount: string;
    date: string;
    accountName: string;
    transactionTypeId?: string;
  }>();

  const { data, isLoading } = useTransactionTypes();
  const updateTransactionType = useUpdateTransactionType();

  const handleSelectType = async (typeId: string) => {
    try {
      await updateTransactionType.mutateAsync({
        transactionId,
        transactionTypeId: typeId,
      });

      router.back();
    } catch (error) {
      console.error("Failed to assign transaction type:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title">{transactionName}</ThemedText>

      <ThemedText style={styles.amount}>
        ${Number(amount).toFixed(2)}
      </ThemedText>

      <View style={styles.details}>
        <ThemedText>{accountName}</ThemedText>
        <ThemedText>{date}</ThemedText>
      </View>

      <ThemedText style={styles.sectionTitle}>Category</ThemedText>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.types}>
          {data?.transactionTypes?.map((type: any) => {
            const selected = type.id === transactionTypeId;

            return (
              <Pressable
                key={type.id}
                disabled={updateTransactionType.isPending}
                style={({ pressed }) => [
                  styles.typeCard,
                  selected && styles.selectedType,
                  pressed && styles.pressed,
                ]}
                onPress={() => handleSelectType(type.id)}
              >
                <ThemedText style={styles.typeName}>
                  {type.name}
                  {selected ? " ✓" : ""}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  amount: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 12,
    lineHeight: 40,
  },

  details: {
    gap: 4,
    marginTop: 12,
    opacity: 0.7,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 32,
    marginBottom: 12,
  },

  types: {
    gap: 10,
  },

  typeCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 14,
  },

  selectedType: {
    borderWidth: 2,
  },

  typeName: {
    fontSize: 16,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.6,
  },
});
