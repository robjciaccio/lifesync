import { useMutation } from "@tanstack/react-query";

import { createPlaidUpdateLinkToken } from "@/api/createPlaidUpdateLinkToken";

export function useReconnectPlaid() {
  return useMutation({
    mutationFn: async (itemId: string) => {
      return createPlaidUpdateLinkToken(itemId);
    },
  });
}
