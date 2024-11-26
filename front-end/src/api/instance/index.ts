import axios from "axios";
import {
  ConfirmRideParams,
  EstimateRideParams,
  GetRidesParams,
} from "../../core/types/params";

export const apiInstance = axios.create({
  baseURL: "http://localhost:8080/ride",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

export const rideRequests = {
  estimate: (data: EstimateRideParams) => apiInstance.post("/estimate", data),
  confirm: (data: ConfirmRideParams) => apiInstance.patch("/confirm", data),
  getRides: (data: GetRidesParams) => {
    const url = data.driver_id
      ? `/${data.customer_id}?driver_id=${data.driver_id}`
      : `/${data.customer_id}`;
    return apiInstance.get(url);
  },
};
