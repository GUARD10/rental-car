"use client";

import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Select } from "@/components/ui/Select/Select";

import { getCarFilters } from "../../api/cars.api";
import type { CarFilters } from "../../types/car.types";
import { filtersToParams, parseFilters } from "../../utils/car.utils";

import styles from "./CatalogFilters.module.css";

export function CatalogFilters({ applied }: { applied: CarFilters }) {
  const router = useRouter();

  const [draft, setDraft] = useState({
    brand: applied.brand ?? "",
    price: applied.price?.toString() ?? "",
    minMileage: applied.minMileage?.toString() ?? "",
    maxMileage: applied.maxMileage?.toString() ?? "",
  });
  const [error, setError] = useState("");

  const metadata = useQuery({
    queryKey: ["car-filters"],
    queryFn: ({ signal }) => getCarFilters(signal),
    staleTime: 3600000,
  });

  const prices: number[] = [];

  if (metadata.data) {
    const { min, max } = metadata.data.price;

    for (let price = min; price <= max; price += 10) {
      prices.push(price);
    }

    if (!prices.includes(max)) {
      prices.push(max);
    }
  }

  const brands = [
    ...new Set([...(metadata.data?.brands ?? []), ...(draft.brand ? [draft.brand] : [])]),
  ];
  const availablePrices = [...new Set([...prices, ...(draft.price ? [Number(draft.price)] : [])])];

  const brandOptions = brands.map((brand) => ({ value: brand, label: brand }));
  const priceOptions = availablePrices.map((price) => ({
    value: String(price),
    label: String(price),
    selectedLabel: `To $${price}`,
  }));

  function update(name: keyof typeof draft, value: string) {
    setDraft({ ...draft, [name]: value });
    setError("");
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      draft.minMileage &&
      draft.maxMileage &&
      Number(draft.minMileage) > Number(draft.maxMileage)
    ) {
      setError("Minimum mileage must not exceed maximum mileage.");

      return;
    }

    const params = filtersToParams(parseFilters(new URLSearchParams(draft)));

    router.push(params.size ? `/catalog?${params}` : "/catalog", { scroll: false });
  }

  function handleClear() {
    setDraft({ brand: "", price: "", minMileage: "", maxMileage: "" });
    setError("");
    router.push("/catalog", { scroll: false });
  }

  return (
    <form className={styles.form} onSubmit={handleSearch}>
      <Select
        label="Car brand"
        placeholder="Choose a brand"
        value={draft.brand}
        disabled={metadata.isPending}
        onChange={(value) => update("brand", value)}
        options={brandOptions}
      />

      <Select
        label="Price / 1 hour"
        placeholder="Choose a price"
        value={draft.price}
        disabled={metadata.isPending}
        onChange={(value) => update("price", value)}
        options={priceOptions}
      />

      <fieldset className={styles.mileage}>
        <legend>Car mileage / km</legend>
        <div>
          <label>
            <span>From</span>
            <input
              aria-label="Mileage from"
              type="number"
              min="0"
              step="1"
              value={draft.minMileage}
              onChange={(e) => update("minMileage", e.target.value)}
            />
          </label>

          <label>
            <span>To</span>
            <input
              aria-label="Mileage to"
              type="number"
              min="0"
              step="1"
              value={draft.maxMileage}
              onChange={(e) => update("maxMileage", e.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <button className="button" type="submit">
        Search
      </button>

      <button className={styles.clear} type="button" onClick={handleClear}>
        Clear filters
      </button>

      {error && (
        <p className={`errorText ${styles.message}`} role="alert">
          {error}
        </p>
      )}

      {metadata.isError && (
        <p className={`errorText ${styles.message}`} role="alert">
          Filter options could not be loaded.{" "}
          <button type="button" onClick={() => metadata.refetch()}>
            Try again
          </button>
        </p>
      )}
    </form>
  );
}
