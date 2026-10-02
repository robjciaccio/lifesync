export async function exchangePlaidToken(publicToken: string) {
  const response = await fetch("http://localhost:3000/plaid/exchange-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange Plaid token: ${response.status}`);
  }

  return response.json();
}
