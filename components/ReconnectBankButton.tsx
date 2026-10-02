import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet } from "react-native";
import {
  createPlaidLinkSession,
  LinkSuccess,
} from "react-native-plaid-link-sdk";
import { useQueryClient } from "@tanstack/react-query";

import { ThemedText } from "@/components/themed-text";
import { useReconnectPlaid } from "@/hooks/useReconnectPlaid";

type Props = {
  itemId: string;
};

export function ReconnectBankButton({ itemId }: Props) {
  const queryClient = useQueryClient();
  const reconnectPlaid = useReconnectPlaid();

  const [isOpening, setIsOpening] = useState(false);

  const handleReconnect = async () => {
    try {
      setIsOpening(true);

      console.log("1. Requesting update Link token for:", itemId);

      const linkToken = await reconnectPlaid.mutateAsync(itemId);

      console.log("2. Got update Link token:", linkToken);

      const session = await createPlaidLinkSession({
        token: linkToken,

        onSuccess: async (success) => {
          console.log("3. PLAID UPDATE SUCCESS:", success);

          // keep your existing refresh code here
        },

        onExit: (exit) => {
          console.log("PLAID UPDATE EXIT:", exit);
        },

        onEvent: (event) => {
          console.log("PLAID UPDATE EVENT:", event);
        },
      });

      console.log("Plaid update session created");

      await session.open();

      console.log("Plaid update session opened");

      console.log("Plaid update session created");
    } catch (error) {
      console.error("Failed to reconnect bank:", error);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={handleReconnect}
      disabled={isOpening || reconnectPlaid.isPending}
    >
      {isOpening || reconnectPlaid.isPending ? (
        <ActivityIndicator />
      ) : (
        <ThemedText style={styles.buttonText}>Reconnect Bank</ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.6,
  },
});
