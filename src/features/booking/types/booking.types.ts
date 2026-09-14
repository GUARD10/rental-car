import type { z } from "zod";

import type { bookingSchema } from "../schemas/booking.schema";

export type BookingRequest = z.infer<typeof bookingSchema>;

export interface BookingResponse {
  message: string;
}
