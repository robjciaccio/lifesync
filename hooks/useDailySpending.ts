import { useQuery } from "@tanstack/react-query";

import { getDailySpending } from "../api/getDailySpending";

export function useDailySpending(year: number, month: number) {
  return useQuery({
    queryKey: ["daily-spending", year, month],
    queryFn: () =>
      getDailySpending({
        year,
        month,
      }),
  });
}
