export async function getTransactionTypes() {
  const response = await fetch("http://localhost:3000/transaction-types");

  if (!response.ok) {
    throw new Error(`Failed to fetch transaction types: ${response.status}`);
  }

  return response.json();
}
