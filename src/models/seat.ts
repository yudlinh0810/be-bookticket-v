export interface Seat {
  id?: number;
  position: string;
  status: "available" | "booked" | "unavailable";
  tripId?: number;
  floor?: "top" | "bottom";
}
