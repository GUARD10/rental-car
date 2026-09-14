import Link from "next/link";
import { FiSearch } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="state">
      <FiSearch size={40} aria-hidden="true" />
      <h1>Page not found</h1>
      <Link href="/catalog" className="button">
        Back to catalog
      </Link>
    </main>
  );
}
