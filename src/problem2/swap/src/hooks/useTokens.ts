import { TOKENS_API_URL } from "@/config/config";
import { httpClient } from "@/httpClient";
import type { Token } from "@/models/models";
import { uniqueByProperty } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";

export const useTokens = () => {
  const tokens = useQuery<Token[]>({
    queryKey: ["tokens"],
    queryFn: async () => {
      // sleep for 1 second to simulate a network delay
      const response = await httpClient.get(
        TOKENS_API_URL
      );
      return uniqueByProperty<Token, "currency">(response.data, "currency");
    },
  });
  return tokens;
}