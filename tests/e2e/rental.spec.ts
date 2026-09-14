import { test, expect } from "@playwright/test";

import type { Car, CarsPage } from "../../src/features/cars/types/car.types";

const api = "https://car-rental-api.goit.study";
const carId = "e58adcfb-4b16-413d-9380-52a025a66db2";

test("live backend filters, pagination and missing car", async ({ request }) => {
  const cases: [string, (car: Car) => boolean][] = [
    ["brand=Volvo", (car) => car.brand === "Volvo"],
    ["price=40", (car) => Number(car.rentalPrice) <= 40],
    ["minMileage=6000", (car) => car.mileage >= 6000],
    ["maxMileage=5000", (car) => car.mileage <= 5000],
    [
      "brand=Volvo&price=40&minMileage=5000&maxMileage=7000",
      (car) =>
        car.brand === "Volvo" &&
        Number(car.rentalPrice) <= 40 &&
        car.mileage >= 5000 &&
        car.mileage <= 7000,
    ],
  ];

  for (const [query, predicate] of cases) {
    const response = await request.get(`${api}/cars?${query}&perPage=12`);

    expect(response.ok()).toBeTruthy();
    const data: CarsPage = await response.json();

    expect(data.cars.length).toBeGreaterThan(0);
    expect(data.cars.every(predicate)).toBeTruthy();
  }

  const missing = await request.get(`${api}/cars/00000000-0000-4000-8000-000000000000`);

  expect(missing.status()).toBe(404);
});

test("home, catalog pagination, new tab and images", async ({ page }) => {
  const errors: string[] = [];

  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Find your perfect rental car", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/home-desktop.png", fullPage: true });
  await page.getByRole("link", { name: "View Catalog" }).click();
  await expect(page.locator("article")).toHaveCount(12);
  await expect
    .poll(() =>
      page
        .locator("article img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
          ),
        ),
    )
    .toBeTruthy();
  await page.screenshot({ path: "test-results/catalog-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "Load More" }).click();
  await expect(page.locator("article")).toHaveCount(24);
  await page.getByRole("button", { name: "Load More" }).click();
  await expect(page.locator("article")).toHaveCount(25);
  await expect(page.getByRole("button", { name: "Load More" })).toHaveCount(0);
  const newPage = page.waitForEvent("popup");

  await page
    .getByRole("link", { name: /Read more about/ })
    .first()
    .click();
  const details = await newPage;

  await expect(details.getByRole("heading", { name: "Book your car now" })).toBeVisible();
  await details.screenshot({ path: "test-results/details-desktop.png", fullPage: true });
  const photoLink = page
    .getByRole("link", { name: /^View .+ details \(opens in a new tab\)$/ })
    .first();
  const photoPopup = page.waitForEvent("popup");

  await photoLink.click();
  const photoDetails = await photoPopup;

  await expect(photoDetails).toHaveURL(details.url());
  await expect(photoDetails.getByRole("heading", { name: "Book your car now" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("applied filters, URL history and filtered Load More", async ({ page, request }) => {
  const filtered: CarsPage = await (await request.get(`${api}/cars?brand=Volvo&perPage=12`)).json();

  await page.goto("/catalog");
  await expect(page.locator("article")).toHaveCount(12);
  await page.getByRole("combobox", { name: "Car brand" }).click();
  await page.getByRole("option", { name: "Volvo", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(12);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/brand=Volvo/);
  await expect(page.locator("article")).toHaveCount(filtered.cars.length);
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Car brand" })).toHaveText("Volvo");
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(12);
  await page.goBack();
  await expect(page.getByRole("combobox", { name: "Car brand" })).toHaveText("Volvo");
  await page.goto("/catalog?price=80");
  await expect(page.locator("article")).toHaveCount(12);
  await page.getByRole("button", { name: "Load More" }).click();
  await expect(page.locator("article")).toHaveCount(24);
  await page.getByLabel("Mileage from").fill("999999");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No cars found" })).toBeVisible();
});

test("booking validation and real backend rejection", async ({ page, request }) => {
  const invalid = await request.post(`${api}/cars/${carId}/booking-requests`, {
    data: { name: "", email: "bad" },
  });

  expect(invalid.status()).toBe(400);
  await page.goto(`/catalog/${carId}`);
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByText("Name is required", { exact: true })).toBeVisible();
  await expect(page.getByText("Enter a valid email address", { exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("RentalCar integration test");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("rentalcar-test@example.com");
  await page
    .getByRole("textbox", { name: "Comment", exact: true })
    .fill("Automated assignment verification. Test request only.");
  await page.route(`${api}/cars/${carId}/booking-requests`, (route) =>
    route.continue({ postData: JSON.stringify({ name: "", email: "bad" }) }),
  );
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByText('"name" is not allowed to be empty', { exact: true })).toBeVisible();
  await page.unroute(`${api}/cars/${carId}/booking-requests`);
});

test("successful booking response resets the form and dismisses notification", async ({ page }) => {
  let submitted: unknown;

  await page.route(`${api}/cars/${carId}/booking-requests`, async (route) => {
    submitted = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ message: "Booking request accepted." }),
    });
  });
  await page.goto(`/catalog/${carId}`);
  await page.getByRole("textbox", { name: "Name", exact: true }).fill(" Test User ");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("test@example.com");
  await page.getByRole("textbox", { name: "Comment", exact: true }).fill(" Weekend rental ");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Booking request accepted.");
  expect(submitted).toEqual({
    name: "Test User",
    email: "test@example.com",
    comment: "Weekend rental",
  });

  for (const name of ["Name", "Email", "Comment"]) {
    await expect(page.getByRole("textbox", { name, exact: true })).toHaveValue("");
  }

  await page.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("catalog and car details support direct navigation and reload", async ({ page }) => {
  for (const path of ["/catalog", `/catalog/${carId}`]) {
    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    const reloaded = await page.reload();

    expect(reloaded?.status()).toBe(200);

    if (path === "/catalog") {
      await expect(page.locator("article")).toHaveCount(12);
    } else {
      await expect(page.getByRole("heading", { name: "Book your car now" })).toBeVisible();
    }
  }
});

test("successful live booking (explicit opt-in)", async ({ page }) => {
  test.skip(
    process.env.ALLOW_LIVE_BOOKING !== "1",
    "Requires explicit approval to create a booking on the live backend.",
  );
  await page.goto(`/catalog/${carId}`);
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("RentalCar integration test");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("rentalcar-test@example.com");
  await page
    .getByRole("textbox", { name: "Comment", exact: true })
    .fill("Automated assignment verification. Test request only.");
  const response = page.waitForResponse(
    (response) =>
      response.url().endsWith("/booking-requests") && response.request().method() === "POST",
  );

  await page.getByRole("button", { name: "Send", exact: true }).click();
  expect((await response).status()).toBe(201);
  await expect(page.getByRole("status")).toContainText("accepted");
  await expect(page.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("");
});

test("network errors, loading and mobile layout", async ({ page }) => {
  await page.route(`${api}/cars?*`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.abort();
  });
  await page.goto("/catalog");
  await expect(page.getByLabel("Loading cars")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Could not load cars" })).toBeVisible();
  await page.unroute(`${api}/cars?*`);
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(12);
  await page.setViewportSize({ width: 390, height: 844 });

  for (const [path, name] of [
    ["/", "home"],
    ["/catalog", "catalog"],
    [`/catalog/${carId}`, "details"],
  ]) {
    await page.goto(path);

    if (name === "catalog") {
      await expect(page.locator("article")).toHaveCount(12);
    }

    if (name === "details") {
      await expect(page.getByRole("heading", { name: "Book your car now" })).toBeVisible();
    }

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
    await page.screenshot({ path: `test-results/${name}-mobile.png`, fullPage: true });
  }

  await page.goto("/catalog/00000000-0000-4000-8000-000000000000");
  await expect(page.getByRole("heading", { name: "Car not found", exact: true })).toBeVisible();
});
