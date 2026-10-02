type UpdateTransactionTypeBudgetParams = {
  transactionTypeId: string;
  monthlyBudget: number;
};

export async function updateTransactionTypeBudget({
  transactionTypeId,
  monthlyBudget,
}: UpdateTransactionTypeBudgetParams) {
  const response = await fetch(
    `http://localhost:3000/transaction-types/${transactionTypeId}/budget`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        monthlyBudget,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to update budget: ${response.status}`);
  }

  return response.json();
}
