import { API_BASE_URL } from "@/lib/env";

import { ApiError } from "./api-error";

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { Accept: "application/json", ...init?.headers },
      signal: init?.signal ?? AbortSignal.timeout(15000),
    });
  } catch (error) {
    if (init?.signal?.aborted) {
      throw error;
    }

    throw new ApiError(0, "Unable to connect. Please try again.");
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body && typeof body.message === "string"
        ? body.message
        : "Something went wrong. Please try again.";

    throw new ApiError(response.status, message, body);
  }

  return body as T;
}
