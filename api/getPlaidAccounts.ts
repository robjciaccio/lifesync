export async function getAccounts() {
  const response = await fetch("http://localhost:3000/accounts");

  if (!response.ok) {
    throw new Error(`Failed to fetch accounts: ${response.status}`);
  }

  return response.json();
}
