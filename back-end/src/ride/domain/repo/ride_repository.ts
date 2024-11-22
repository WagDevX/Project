import { ResultFuture } from "../../../core/typedefs/result_future";
import { Driver } from "../entities/driver";

export abstract class RideRepository {
  abstract createDriver(params: Driver): ResultFuture<Driver>;
}
