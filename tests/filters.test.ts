import { test } from "node:test";
import assert from "node:assert/strict";

import { filtersToParams, parseFilters } from "../src/features/cars/utils/car.utils";
import { bookingSchema } from "../src/features/booking/schemas/booking.schema";

test("URL filters preserve valid zero values and encoded brands", () => {
  const filters = parseFilters(
    new URLSearchParams("brand=Mercedes-Benz&price=40&minMileage=0&maxMileage=5000"),
  );

  assert.equal(filters.minMileage, 0);
  assert.equal(filters.brand, "Mercedes-Benz");
  assert.deepEqual(parseFilters(filtersToParams(filters)), filters);
});

test("invalid and reversed URL mileage values are normalized", () => {
  for (const value of ["-1", "NaN", "Infinity", "1e4", "1.5", "9007199254740992"]) {
    assert.equal(parseFilters(new URLSearchParams({ minMileage: value })).minMileage, undefined);
  }

  assert.equal(
    parseFilters(new URLSearchParams("minMileage=100&maxMileage=50")).maxMileage,
    undefined,
  );
});

test("booking validates required fields and sends only accepted fields", () => {
  assert.equal(bookingSchema.safeParse({ name: " ", email: "wrong" }).success, false);
  assert.deepEqual(
    bookingSchema.parse({ name: " Test ", email: "test@example.com", bookingDate: "2026-10-01" }),
    { name: "Test", email: "test@example.com" },
  );
});
