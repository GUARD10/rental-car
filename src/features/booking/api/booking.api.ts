import { z } from "zod";

import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/api-error";

import type { BookingRequest, BookingResponse } from "../types/booking.types";

const validationErrorSchema = z.object({
  validation: z.object({
    body: z.object({
      keys: z.array(z.string()),
      message: z.string(),
    }),
  }),
});

export function createBooking(carId: string, request: BookingRequest) {
  return apiRequest<BookingResponse>(`/cars/${encodeURIComponent(carId)}/booking-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export function getBookingValidation(error: unknown) {
  if (!(error instanceof ApiError)) {
    return undefined;
  }

  const result = validationErrorSchema.safeParse(error.details);

  return result.success ? result.data.validation.body : undefined;
}
