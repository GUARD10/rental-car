"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FiAlertCircle } from "react-icons/fi";

import { parseFilters } from "../../utils/car.utils";
import { useCars } from "../../hooks/useCars";
import { CarCard } from "../CarCard/CarCard";
import { CatalogFilters } from "../CatalogFilters/CatalogFilters";

import styles from "./Catalog.module.css";

export function CatalogSkeleton() {
  return (
    <div className={styles.loading} aria-busy="true" aria-label="Loading cars">
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={styles.skeleton}>
            <div />
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>

      <div className={styles.overlay}>
        <div className={styles.loadingPanel} role="status">
          <span className={styles.spinner} />
          <h2>Loading cars...</h2>
          <p>
            Please wait while we fetch the best
            <br />
            cars for you
          </p>
        </div>
      </div>
    </div>
  );
}

export function Catalog() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = parseFilters(searchParams);
  const query = useCars(filters);
  const cars = query.data?.pages.flatMap((page) => page.cars) ?? [];

  return (
    <>
      <CatalogFilters key={searchParams.toString()} applied={filters} />
      {query.isPending ? (
        <CatalogSkeleton />
      ) : (
        <>
          {cars.length > 0 && (
            <div className={styles.grid}>
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}

          {query.isError && (
            <div className="state" role="alert">
              <FiAlertCircle size={36} aria-hidden="true" />
              <h2>Could not load cars</h2>
              <p>{query.error.message}</p>
              <button
                className="button"
                onClick={() =>
                  query.isFetchNextPageError ? query.fetchNextPage() : query.refetch()
                }
              >
                Try again
              </button>
            </div>
          )}

          {!query.isError && cars.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.illustration}>
                <Image
                  src="/images/no-cars.png"
                  alt="Magnifier searching for a car"
                  fill
                  sizes="(max-width: 600px) 100vw, 480px"
                />
              </div>

              <h2>No cars found</h2>
              <p>
                We couldn’t find any cars that match your current filters. Try changing your search
                criteria or reset the filters.
              </p>

              <button className="button secondary" onClick={() => router.push("/catalog")}>
                Reset filters
              </button>
            </div>
          )}

          {query.hasNextPage && (
            <div className={styles.more}>
              <button
                className="button secondary"
                disabled={query.isFetching}
                onClick={() => {
                  if (!query.isFetching) {
                    void query.fetchNextPage();
                  }
                }}
              >
                {query.isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          <p className="srOnly" role="status">
            {cars.length} cars loaded
          </p>
        </>
      )}
    </>
  );
}
