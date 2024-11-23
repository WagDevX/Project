export interface RideOptions {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: [DriverOption];
  routeResponse: object;
}

export interface DriverOption {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment?: string;
  };
  value: number;
}

export interface Ride {
  id: number;
  date: Date;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}
