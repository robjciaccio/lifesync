import { useInfiniteQuery } from "@tanstack/react-query";

import { getTransactions } from "../api/getTransactions";

type UseTransactionsParams = {
  date?: string;
  accountId?: string;
};

export function useTransactions({
  date,
  accountId,
}: UseTransactionsParams = {}) {
  return useInfiniteQuery({
    queryKey: [
      "transactions",
      {
        date,
        accountId,
      },
    ],

    queryFn: ({ pageParam }) =>
      getTransactions({
        pageParam,
        date,
        accountId,
      }),

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
  });
}
