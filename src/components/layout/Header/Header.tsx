"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./Header.module.css";

export function Header() {
  const path = usePathname();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.logo} href="/" aria-label="RentalCar home">
          <svg
            width="28"
            height="28"
            viewBox="0 0 512 512"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <rect width="512" height="512" rx="128" fill="var(--accent)" />
            <g
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(64, 64) scale(16)"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </g>
          </svg>

          <span>
            Rental<span className={styles.accent}>Car</span>
          </span>
        </Link>

        <nav aria-label="Main navigation">
          <Link href="/" aria-current={path === "/" ? "page" : undefined}>
            Home
          </Link>

          <Link href="/catalog" aria-current={path === "/catalog" ? "page" : undefined}>
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
