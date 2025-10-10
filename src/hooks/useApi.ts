import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";
import { showToast } from "@/utils/toastHelper";

export function useApi({
  endpoint,
  method = "GET",
  queryKey,
  invalidateKey,
  enabled = true,
  onSuccess,
  onError,
  headers,
  params = {},
}) {
  const queryClient = useQueryClient();

  if (method === "GET") {
    return useQuery({
      queryKey: queryKey
        ? Array.isArray(queryKey)
          ? queryKey
          : [queryKey]
        : [endpoint, params],
      queryFn: async () => {
        const res = await axios.get(endpoint, { params }).catch((err) => {
          showToast.error(err?.response?.data?.message || "Xatolik yuz berdi");
        });

        return res.data;
      },
      enabled,
      refetchOnWindowFocus: false,
    });
  }

  return useMutation({
    mutationFn: async (variables) => {
      const config = headers ? { headers } : {};
      switch (method) {
        case "POST":
          return (await axios.post(endpoint, variables, config)).data;
        case "PUT":
          const putUrl = variables?.endpoint || endpoint;
          const putData = variables?.data || variables;

          // If putData is FormData, we need to handle it differently
          if (putData instanceof FormData) {
            return (
              await axios.put(putUrl, putData, {
                ...config,
                headers: {
                  ...config.headers,
                  "Content-Type": "multipart/form-data",
                },
              })
            ).data;
          }

          // If variables has data field, use it
          if (variables?.data) {
            return (await axios.put(putUrl, variables.data, config)).data;
          }

          return (await axios.put(putUrl, putData, config)).data;
        case "DELETE":
          const url = variables?.endpoint || endpoint; // ⬅️ endpoint ni variables ichidan o‘qiymiz
          return (await axios.delete(url)).data;
        default:
          throw new Error("Invalid method");
      }
    },
    onSuccess: (data) => {
      if (invalidateKey)
        queryClient.invalidateQueries({
          queryKey: Array.isArray(invalidateKey)
            ? invalidateKey
            : [invalidateKey],
        });
      else queryClient.invalidateQueries();
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error?.response?.data?.message || error);
    },
  });
}
