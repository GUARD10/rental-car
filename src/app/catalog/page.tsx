import { Suspense } from "react";

import { Catalog, CatalogSkeleton } from "@/features/cars/components/Catalog/Catalog";

export const metadata = { title: "Catalog" };

export default function CatalogPage() {
  return (
    <main className="container" style={{ paddingBlock: "48px 96px" }}>
      <h1 className="srOnly">Rental car catalog</h1>
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog />
      </Suspense>
    </main>
  );
}
