export interface Car {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: number | string;
  engine: string;
  rentalPrice: string;
  rentalCompany: string;
  location: { country: string; city: string; address: string };
  rentalConditions: string[];
  features: string[];
  mileage: number;
  stockNumber?: number;
}

export interface CarsPage {
  cars: Car[];
  totalCars: number;
  page: number;
  totalPages: number;
  perPage?: number;
}

export interface CarFilters {
  brand?: string;
  price?: number;
  minMileage?: number;
  maxMileage?: number;
}

export interface FilterMetadata {
  brands: string[];
  price: { min: number; max: number };
}
