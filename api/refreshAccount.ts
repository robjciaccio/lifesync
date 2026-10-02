export async function refreshAccounts() {
  const response = await fetch("http://localhost:3000/accounts/refresh", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to refresh accounts");
  }

  return response.json();
}
