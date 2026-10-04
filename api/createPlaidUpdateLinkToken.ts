import { API_URL } from "@/config/api";

export async function createPlaidUpdateLinkToken(itemId: string) {
  const response = await fetch(`${API_URL}/plaid/update-link-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create update link token: ${response.status}`);
  }

  const data = await response.json();

  return data.linkToken as string;
}
