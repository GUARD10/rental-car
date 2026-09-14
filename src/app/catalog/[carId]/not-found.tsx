import Link from "next/link";
import { FiSearch } from "react-icons/fi";

export default function CarNotFound() {
  return (
    <main className="state">
      <FiSearch size={48} aria-hidden="true" />
      <h1>Car not found</h1>
      <p>This car is no longer available.</p>
      <Link className="button" href="/catalog">
        Back to catalog
      </Link>
    </main>
  );
}
