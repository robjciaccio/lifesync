import { useQuery } from "@tanstack/react-query";

import { getSpendingByType } from "@/api/getSpendingByType";

export function useSpendingByType(year: number, month: number) {
  return useQuery({
    queryKey: ["spending-by-type", year, month],

    queryFn: () =>
      getSpendingByType({
        year,
        month,
      }),
  });
}
