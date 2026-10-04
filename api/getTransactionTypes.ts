import { API_URL } from "@/config/api";
export async function getTransactionTypes() {
  const response = await fetch(`${API_URL}/transaction-types`);

  if (!response.ok) {
    throw new Error(`Failed to fetch transaction types: ${response.status}`);
  }

  return response.json();
}
