import { ResultFuture } from "../../../core/typedefs/result_future";
import { Driver } from "../entities/driver";
import { RideOptions } from "../entities/ride";
import { EstimateRideParams } from "../usecases/estimate_ride";

export abstract class RideRepository {
  abstract createDriver(params: Driver): ResultFuture<Driver>;
  abstract estimateRide(params: EstimateRideParams): ResultFuture<RideOptions>;
}
