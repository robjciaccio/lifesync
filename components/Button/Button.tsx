import { Button } from "react-native";
import {
  createPlaidLinkSession,
  LinkSuccess,
} from "react-native-plaid-link-sdk";

import { getPlaidLinkToken } from "../api/getPlaidLinkToken";

export function ConnectBankButton() {
  const handleConnect = async () => {
    const linkToken = await getPlaidLinkToken();

    const session = await createPlaidLinkSession({
      token: linkToken,
    });

    session.open({
      onSuccess: (success: LinkSuccess) => {
        console.log("Plaid public token:", success.publicToken);
      },
      onExit: (exit) => {
        console.log("Plaid exited:", exit);
      },
    });
  };

  return <Button title="Connect bank" onPress={handleConnect} />;
}
