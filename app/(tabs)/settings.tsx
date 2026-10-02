import { Alert, Button, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import { resetDatabase } from "../../api/resetDB";

export default function SettingsScreen() {
  const queryClient = useQueryClient();

  const handleClearDatabase = () => {
    Alert.alert("Clear database?", "This will remove all connected accounts.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            await resetDatabase();

            await queryClient.invalidateQueries({
              queryKey: ["accounts"],
            });
          } catch (error) {
            console.error("Failed to clear database:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Clear database"
        color="red"
        onPress={handleClearDatabase}
      />
    </View>
  );
}
