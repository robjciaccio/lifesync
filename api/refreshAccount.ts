import { API_URL } from "@/config/api";
export async function refreshAccounts() {
  const response = await fetch(`${API_URL}/accounts/refresh`, {
    method: "POST",
  });
  // this file refreshes the accounts and returns updated accounts
  if (!response.ok) {
    throw new Error("Failed to refresh accounts");
  }

  return response.json();
}
