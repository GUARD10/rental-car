import Link from "next/link";
import Image from "next/image";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <Image
          src="/images/reference-hero.jpg"
          alt="Sports car driving along a sunlit highway"
          fill
          preload
          sizes="100vw"
          className={styles.photo}
        />

        <div className={styles.content}>
          <h1>Find your perfect rental car</h1>
          <p>Reliable and budget-friendly rentals for any journey</p>
          <Link className="button" href="/catalog">
            View Catalog
          </Link>
        </div>
      </section>
    </main>
  );
}
