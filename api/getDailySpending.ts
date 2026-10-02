type GetDailySpendingParams = {
  year: number;
  month: number;
};

export async function getDailySpending({
  year,
  month,
}: GetDailySpendingParams) {
  const response = await fetch(
    `http://localhost:3000/transactions/daily-spending?year=${year}&month=${month}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch daily spending: ${response.status}`);
  }

  return response.json();
}
