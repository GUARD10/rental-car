"use client";

import { FiAlertCircle } from "react-icons/fi";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="state">
      <FiAlertCircle size={40} aria-hidden="true" />
      <h1>Unable to load this page</h1>
      <p>Please try again in a moment.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
