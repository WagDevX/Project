export interface ConfirmRideParams {
  customer_id: string;
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

export interface EstimateRideParams {
  customer_id: string;
  origin: string;
  destination: string;
}

export interface GetRidesParams {
  customer_id: string;
  driver_id: number | undefined;
}
