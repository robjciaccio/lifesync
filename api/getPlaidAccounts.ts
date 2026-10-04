import { API_URL } from "@/config/api";
export async function getAccounts() {
  const response = await fetch(`${API_URL}/accounts`);

  if (!response.ok) {
    throw new Error(`Failed to fetch accounts: ${response.status}`);
  }

  return response.json();
}
