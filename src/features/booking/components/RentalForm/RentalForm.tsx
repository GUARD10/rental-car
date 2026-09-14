"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiCheckCircle, FiX } from "react-icons/fi";

import { bookingSchema } from "../../schemas/booking.schema";
import type { BookingRequest } from "../../types/booking.types";
import { createBooking, getBookingValidation } from "../../api/booking.api";

import styles from "./RentalForm.module.css";

export function RentalForm({ carId }: { carId: string }) {
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<BookingRequest>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", email: "", comment: "" },
  });

  async function submitBooking(values: BookingRequest) {
    clearErrors("root");
    setSuccess("");

    try {
      const response = await createBooking(carId, values);

      setSuccess(response.message);
      reset();
    } catch (error) {
      const validation = getBookingValidation(error);
      const fields = validation?.keys.filter(
        (key): key is keyof BookingRequest =>
          key === "name" || key === "email" || key === "comment",
      );

      if (validation && fields?.length) {
        for (const field of fields) {
          setError(field, { type: "server", message: validation.message });
        }
      } else {
        setError("root", {
          message: error instanceof Error ? error.message : "Booking failed. Please try again.",
        });
      }
    }
  }

  return (
    <section className={styles.panel}>
      <h2>Book your car now</h2>
      <p>Stay connected! We are always ready to help you.</p>
      <form noValidate onSubmit={handleSubmit(submitBooking)}>
        <div>
          <label>
            <span className="srOnly">Name</span>
            <input
              className="field"
              placeholder="Name*"
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
          </label>

          {errors.name && (
            <span id="name-error" className="errorText">
              {errors.name.message}
            </span>
          )}
        </div>

        <div>
          <label>
            <span className="srOnly">Email</span>
            <input
              className="field"
              placeholder="Email*"
              type="email"
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </label>

          {errors.email && (
            <span id="email-error" className="errorText">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label>
            <span className="srOnly">Comment</span>
            <textarea
              className="field"
              placeholder="Comment"
              rows={4}
              aria-invalid={!!errors.comment}
              aria-describedby={errors.comment ? "comment-error" : undefined}
              {...register("comment")}
            />
          </label>

          {errors.comment && (
            <span id="comment-error" className="errorText">
              {errors.comment.message}
            </span>
          )}
        </div>

        {errors.root && (
          <p className="errorText" role="alert">
            {errors.root.message}
          </p>
        )}

        <button className="button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>

      {success && (
        <div className={styles.success} role="status">
          <FiCheckCircle size={22} aria-hidden="true" />
          <p>{success}</p>
          <button
            aria-label="Dismiss notification"
            title="Dismiss notification"
            onClick={() => setSuccess("")}
          >
            <FiX size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
