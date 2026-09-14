"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getCars } from "../api/cars.api";
import type { CarFilters } from "../types/car.types";

export function useCars(filters: CarFilters) {
  return useInfiniteQuery({
    queryKey: ["cars", filters],
    queryFn: ({ pageParam, signal }) => getCars(filters, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}
