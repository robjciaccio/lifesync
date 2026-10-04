import { API_URL } from "@/config/api";
export async function getPlaidLinkToken() {
  const response = await fetch(`${API_URL}/plaid/link-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Plaid link token: ${response.status}`);
  }

  const data = await response.json();

  return data.linkToken as string;
}
