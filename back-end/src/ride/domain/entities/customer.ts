import { Ride } from "./ride";

export interface Customer {
  id?: number;
  name: string;
  rides: [Ride];
}
