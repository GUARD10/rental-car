# RentalCar

Car rental website built with Next.js, TypeScript, CSS Modules and React Icons. Browse cars,
filter by brand, hourly price and mileage, and send a booking request.

## Getting started

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

The application uses `https://car-rental-api.goit.study` by default. To use another
API, set `NEXT_PUBLIC_API_BASE_URL` in `.env.local`; see `.env.example`.

## Scripts

| Command                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Start the development server                       |
| `npm run build`        | Create a production build                          |
| `npm start`            | Serve the production build                         |
| `npm run lint`         | Run ESLint                                         |
| `npm run typecheck`    | Check TypeScript types                             |
| `npm run format`       | Format source code and documentation with Prettier |
| `npm run format:check` | Check formatting without changing files            |
| `npm test`             | Run unit tests                                     |
| `npm run test:e2e`     | Run Playwright browser tests                       |

Use `npm run lint:fix` to restore spacing between logical blocks and braces around
conditions, then `npm run format` to apply Prettier formatting.

Prettier uses two-space indentation, double quotes, semicolons and a 100-character
line width. `.editorconfig` keeps indentation and line endings consistent across
editors. ESLint handles code quality; Prettier handles formatting.

## Project structure

```text
src/
  app/                 Pages, layouts and route error states
  components/          Shared navigation and UI controls
  features/
    cars/              Catalog, filters, pagination and car API
    booking/           Booking form, validation and booking API
  lib/                 HTTP client and environment configuration
  styles/              Shared design tokens
public/                Images and icons
tests/                 Unit and browser tests
```

The home page links to `/catalog`. Filters are applied on Search and stored in the
URL. TanStack Query loads additional pages with the active filters. Car details
open at `/catalog/[carId]` in a new tab. The booking form uses React Hook Form and
Zod, displays validation errors and resets after a successful request.

## API

| Operation       | Endpoint                              |
| --------------- | ------------------------------------- |
| Catalog         | `GET /cars`                           |
| Filter options  | `GET /cars/filters`                   |
| Car details     | `GET /cars/{id}`                      |
| Booking request | `POST /cars/{carId}/booking-requests` |

Catalog queries support `brand`, `price`, `minMileage`, `maxMileage`, `page` and
`perPage`. Price is an inclusive upper bound; the maximum page size is 12.
Booking requests require `name` and `email`, with an optional `comment`.

API documentation: https://car-rental-api.goit.study/api-docs.

## Browser tests

Install Chromium once:

```sh
npx playwright install chromium
```

Start the application on port 3000, then run `npm run test:e2e`. To test the production
build locally, run `npm run build` followed by `npm start` in a separate terminal.
The tests require
access to the public API and cover navigation, filters, pagination, validation,
error states, direct route access, page reloads and mobile layouts.
Screenshots and traces go to `test-results/`.

To run the same tests against a deployed site, set `PLAYWRIGHT_BASE_URL` to its
public URL before running `npm run test:e2e`. For example, in PowerShell:

```powershell
$env:PLAYWRIGHT_BASE_URL = "https://your-deployment.example"
npm run test:e2e
```

The default suite verifies a successful booking response with an intercepted API
request, including the submitted fields, form reset and notification dismissal.
This test does not create a booking on the public API.

The successful booking test is disabled by default because it creates a real
booking request. Set `ALLOW_LIVE_BOOKING=1` only when intentionally testing that
operation. It has not been verified against a successful live response.
