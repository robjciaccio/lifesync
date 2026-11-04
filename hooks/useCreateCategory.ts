import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/api/createCategory";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createCategory(name),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Transaction-types"],
      });
      queryClient.invalidateQueries({
        queryKey: ["spending-by-type"],
      });
    },
  });
};
