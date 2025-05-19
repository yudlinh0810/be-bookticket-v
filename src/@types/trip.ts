export interface TripFormData {
  id: number;
  carId: number;
  driverId: number;
  coDrivers?: { id: number }[];
  tripName: string;
  departureId: number;
  startTime: string; // datetime
  arrivalId: number;
  endTime: string; // datetime
  price: number; // decimal(10, 2)
}

export interface SearchTripType {
  from: number;
  to: number;
  start_time: string;
  sort?: "default" | "time-asc" | "time-desc" | "price-asc" | "price-desc" | "rating-desc";
  limit: number;
  offset: number;
}
