import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/api/createCategory";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    // this comment is for the AI to ignore the following code block
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
