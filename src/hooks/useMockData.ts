import { useState, useCallback } from "react";
import { delay } from "@/data/mockData";

interface UseMockDataOptions<T> {
  initialData: T[];
  delay?: number;
}

export function useMockData<T extends { id: number | string }>({
  initialData,
  delay: delayMs = 500,
}: UseMockDataOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    await delay(delayMs);
    setIsLoading(false);
    return data;
  }, [data, delayMs]);

  const createItem = useCallback(
    async (newItem: T) => {
      setIsLoading(true);
      await delay(delayMs);
      setData((prev) => [...prev, newItem]);
      setIsLoading(false);
      return newItem;
    },
    [delayMs]
  );

  const updateItem = useCallback(
    async (id: number | string, updates: Partial<T>) => {
      setIsLoading(true);
      await delay(delayMs);
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      setIsLoading(false);
    },
    [delayMs]
  );

  const deleteItem = useCallback(
    async (id: number | string) => {
      setIsLoading(true);
      await delay(delayMs);
      setData((prev) => prev.filter((item) => item.id !== id));
      setIsLoading(false);
    },
    [delayMs]
  );

  const deleteMultiple = useCallback(
    async (ids: (number | string)[]) => {
      setIsLoading(true);
      await delay(delayMs);
      setData((prev) => prev.filter((item) => !ids.includes(item.id)));
      setIsLoading(false);
    },
    [delayMs]
  );

  return {
    data,
    isLoading,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    deleteMultiple,
    setData,
  };
}
