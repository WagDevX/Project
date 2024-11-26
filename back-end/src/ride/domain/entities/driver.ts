import { Review } from "./review";
import { Ride } from "./ride";

export interface Driver {
  id?: number;
  description: string;
  name: string;
  car: string;
  tax: number;
  review: Review | undefined | null;
  minKm: number;
  rides: [Ride] | [];
}
