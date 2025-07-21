import { httpClient } from "@/httpClient";
import type { FormValues } from "@/models/models";
import { useMutation } from "@tanstack/react-query"

export const useSwap = () => {
  return useMutation({
    mutationKey: ['swap'],
    mutationFn: async (data: FormValues) => {
      const result = await httpClient.post('/swap', data);
      return result
    }
  })
}