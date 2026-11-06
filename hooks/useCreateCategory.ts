import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/api/createCategory";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    // this comment is for a code commit. nothing else
    //so if you see if you can delete it :)
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
