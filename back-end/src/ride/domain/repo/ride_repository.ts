import { ResultFuture } from "../../../core/typedefs/result_future";
import { Driver } from "../entities/driver";
import { Ride, RideOptions } from "../entities/ride";
import { ConfirmRideParams } from "../usecases/confirm_ride";
import { EstimateRideParams } from "../usecases/estimate_ride";

export abstract class RideRepository {
  abstract createDriver(params: Driver): ResultFuture<Driver>;
  abstract estimateRide(params: EstimateRideParams): ResultFuture<RideOptions>;
  abstract confirmRide(params: ConfirmRideParams): ResultFuture<void>;
}
