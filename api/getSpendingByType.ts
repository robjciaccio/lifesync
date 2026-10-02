export type SpendingByType = {
  id: string;
  name: string;
  spent: number;
  transactionCount: number;
  monthlyBudget: number | null;
};

export type SpendingByTypeResponse = {
  year: number;
  month: number;
  spendingByType: SpendingByType[];
};

type GetSpendingByTypeParams = {
  year: number;
  month: number;
};

export async function getSpendingByType({
  year,
  month,
}: GetSpendingByTypeParams): Promise<SpendingByTypeResponse> {
  const params = new URLSearchParams({
    year: year.toString(),
    month: month.toString(),
  });

  const response = await fetch(
    `http://localhost:3000/transactions/spending-by-type?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch spending by type: ${response.status}`);
  }

  return response.json();
}
