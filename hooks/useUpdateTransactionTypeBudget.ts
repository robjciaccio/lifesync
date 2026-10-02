import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTransactionTypeBudget } from "@/api/updateTransactionTypeBudget";

export function useUpdateTransactionTypeBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransactionTypeBudget,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["spending-by-type"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["transaction-types"],
      });
    },
  });
}
