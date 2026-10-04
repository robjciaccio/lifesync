import { API_URL } from "@/config/api";

type UpdateTransactionTypeParams = {
  transactionId: string;
  transactionTypeId: string;
};

export async function updateTransactionType({
  transactionId,
  transactionTypeId,
}: UpdateTransactionTypeParams) {
  const response = await fetch(
    `${API_URL}/transactions/${transactionId}/type`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionTypeId,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to update transaction type: ${response.status}`);
  }

  return response.json();
}
