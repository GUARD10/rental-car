import type { CarFilters } from "../types/car.types";

function readNumber(value: string | null, integer = false): number | undefined {
  if (!value || !/^\d+(\.\d+)?$/.test(value)) {
    return undefined;
  }

  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number > Number.MAX_SAFE_INTEGER ||
    (integer && !Number.isInteger(number))
  ) {
    return undefined;
  }

  return number;
}

export function parseFilters(params: Pick<URLSearchParams, "get">): CarFilters {
  const brand = params.get("brand")?.trim();
  const minMileage = readNumber(params.get("minMileage"), true);
  const maxMileage = readNumber(params.get("maxMileage"), true);

  return {
    brand: brand || undefined,
    price: readNumber(params.get("price")),
    minMileage,
    maxMileage:
      minMileage !== undefined && maxMileage !== undefined && minMileage > maxMileage
        ? undefined
        : maxMileage,
  };
}

export function filtersToParams(filters: CarFilters): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  return params;
}

export const formatMileage = (mileage: number) =>
  new Intl.NumberFormat("en-US").format(mileage).replaceAll(",", " ");
