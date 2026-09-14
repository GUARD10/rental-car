import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  comment: z.string().trim().optional(),
});
