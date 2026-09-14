import Image from "next/image";

import type { Car } from "../../types/car.types";
import { formatMileage } from "../../utils/car.utils";

import styles from "./CarCard.module.css";

export function CarCard({ car }: { car: Car }) {
  const detailsUrl = `/catalog/${encodeURIComponent(car.id)}`;

  return (
    <article className={styles.card}>
      <a
        href={detailsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.image}
        aria-label={`View ${car.brand} ${car.model} details (opens in a new tab)`}
      >
        <Image
          src={car.img}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw"
          unoptimized
        />
      </a>

      <div className={styles.heading}>
        <h2>
          {car.brand} <span>{car.model}</span>, {car.year}
        </h2>

        <strong>${car.rentalPrice}</strong>
      </div>

      <div className={styles.badges}>
        <div className={styles.meta}>
          <span>{car.location.city}</span>
          <span>{car.location.country}</span>
          <span>{car.rentalCompany}</span>
        </div>

        <div className={styles.meta}>
          <span>{car.type}</span>
          <span>{formatMileage(car.mileage)} km</span>
        </div>
      </div>

      <a
        href={detailsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`button ${styles.action}`}
        aria-label={`Read more about ${car.brand} ${car.model} (opens in a new tab)`}
      >
        Read more
      </a>
    </article>
  );
}
