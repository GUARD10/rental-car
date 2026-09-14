import { apiRequest } from "@/lib/api/client";

import type { Car, CarFilters, CarsPage, FilterMetadata } from "../types/car.types";
import { filtersToParams } from "../utils/car.utils";

export function getCars(filters: CarFilters, page = 1, signal?: AbortSignal) {
  const params = filtersToParams(filters);

  params.set("page", String(page));
  params.set("perPage", "12");

  return apiRequest<CarsPage>(`/cars?${params}`, { signal });
}

export function getCarById(id: string) {
  return apiRequest<Car>(`/cars/${encodeURIComponent(id)}`, { cache: "no-store" });
}

export function getCarFilters(signal?: AbortSignal) {
  return apiRequest<FilterMetadata>("/cars/filters", { signal });
}
