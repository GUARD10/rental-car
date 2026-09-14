import Image from "next/image";
import { notFound } from "next/navigation";

import { getCarById } from "@/features/cars/api/cars.api";
import { formatMileage } from "@/features/cars/utils/car.utils";
import { ApiError } from "@/lib/api/api-error";
import { RentalForm } from "@/features/booking/components/RentalForm/RentalForm";

import styles from "./page.module.css";

export default async function CarDetails({ params }: { params: Promise<{ carId: string }> }) {
  const { carId } = await params;
  const car = await getCarById(carId).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  });

  return (
    <main className={`container ${styles.page}`}>
      <div className={styles.columns}>
        <div className={styles.left}>
          <div className={styles.image}>
            <Image
              src={car.img}
              alt={`${car.brand} ${car.model}, ${car.year}`}
              fill
              preload
              unoptimized
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>

          <RentalForm carId={car.id} />
        </div>

        <div className={styles.details}>
          <div className={styles.title}>
            <h1>
              {car.brand} {car.model}, {car.year}
            </h1>

            <p className={styles.id}>Article: {car.stockNumber ?? car.id}</p>
          </div>

          <div className={styles.location}>
            <span>
              <Image src="/images/figma/location.svg" alt="" width={16} height={16} />
              {car.location.city}, {car.location.country}
            </span>
          </div>

          <p className={styles.price}>${car.rentalPrice}</p>
          <p className={styles.description}>{car.description}</p>
          <section>
            <h2>Rental Conditions:</h2>
            <ul>
              {car.rentalConditions.map((condition) => (
                <li key={condition}>
                  <Image src="/images/figma/check.svg" alt="" width={16} height={16} />
                  {condition}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Car Specifications:</h2>
            <ul>
              <li>
                <Image src="/images/figma/calendar.svg" alt="" width={16} height={16} />
                Year: {car.year}
              </li>

              <li>
                <Image src="/images/figma/car.svg" alt="" width={16} height={16} />
                Type: {car.type}
              </li>

              <li>
                <Image src="/images/figma/fuel.svg" alt="" width={16} height={16} />
                Fuel Consumption: {car.fuelConsumption}
              </li>

              <li>
                <Image src="/images/figma/gear.svg" alt="" width={16} height={16} />
                Engine: {car.engine}
              </li>

              <li>
                <Image src="/images/figma/road.svg" alt="" width={16} height={16} />
                Mileage: {formatMileage(car.mileage)} km
              </li>
            </ul>
          </section>

          <section>
            <h2>Features</h2>
            <ul>
              {car.features.map((feature) => (
                <li key={feature}>
                  <Image src="/images/figma/check.svg" alt="" width={16} height={16} />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
