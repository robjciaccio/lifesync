import { API_URL } from "@/config/api";
type GetTransactionsParams = {
  pageParam?: string | null;
  date?: string;
  accountId?: string;
};

export async function getTransactions({
  pageParam,
  date,
  accountId,
}: GetTransactionsParams) {
  const params = new URLSearchParams({
    limit: "50",
  });

  if (pageParam) {
    params.set("cursor", pageParam);
  }

  if (date) {
    params.set("date", date);
  }

  if (accountId) {
    params.set("accountId", accountId);
  }

  const response = await fetch(`${API_URL}/transactions?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.status}`);
  }

  return response.json();
}
