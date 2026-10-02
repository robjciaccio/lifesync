import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTransactionType } from "@/api/updateTransactionTypes";

export function useUpdateTransactionType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransactionType,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["daily-spending"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["spending-by-type"],
        }),
      ]);
    },
  });
}
