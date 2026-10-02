import { useQuery } from "@tanstack/react-query";

import { getTransactionTypes } from "@/api/getTransactionTypes";

export function useTransactionTypes() {
  return useQuery({
    queryKey: ["transaction-types"],
    queryFn: getTransactionTypes,
  });
}
