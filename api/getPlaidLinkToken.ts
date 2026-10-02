export async function getPlaidLinkToken() {
  const response = await fetch("http://localhost:3000/plaid/link-token", {
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
