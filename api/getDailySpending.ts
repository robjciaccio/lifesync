import { API_URL } from "@/config/api";

type GetDailySpendingParams = {
  year: number;
  month: number;
};
// get daily spending for a given year and month
export async function getDailySpending({
  year,
  month,
}: GetDailySpendingParams) {
  const response = await fetch(
    `${API_URL}/transactions/daily-spending?year=${year}&month=${month}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch daily spending: ${response.status}`);
  }

  return response.json();
}
