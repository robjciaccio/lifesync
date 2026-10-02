import { Button } from "react-native";
import { createPlaidLinkSession } from "react-native-plaid-link-sdk";
import { useQueryClient } from "@tanstack/react-query";

import { getPlaidLinkToken } from "../api/getPlaidLinkToken";
import { exchangePlaidToken } from "../api/exchangePlaidToken";

export function ConnectBankButton() {
  const queryClient = useQueryClient();

  const handleConnect = async () => {
    try {
      const linkToken = await getPlaidLinkToken();

      const session = await createPlaidLinkSession({
        token: linkToken,

        onSuccess: async (success) => {
          try {
            await exchangePlaidToken(success.publicToken);

            await queryClient.invalidateQueries({
              queryKey: ["accounts"],
            });
          } catch (error) {
            console.error("Token exchange failed:", error);
          }
        },

        onExit: (exit) => {
          console.log("Plaid exited:", exit);
        },

        onEvent: (event) => {
          console.log("Plaid event:", event);
        },
      });

      session.open();
    } catch (error) {
      console.error("Plaid connection failed:", error);
    }
  };

  return <Button title="Connect bank" onPress={handleConnect} />;
}
