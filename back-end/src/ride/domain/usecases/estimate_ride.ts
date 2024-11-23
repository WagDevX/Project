import { ResultFuture } from "../../../core/typedefs/result_future";
import { UseCaseWithParams } from "../../../core/usecases/usecases";
import { RideOptions } from "../entities/ride";
import { RideRepository } from "../repo/ride_repository";

export class EstimateRide extends UseCaseWithParams<
  RideOptions,
  EstimateRideParams
> {
  constructor(private readonly rideRepository: RideRepository) {
    super();
  }
  call(params: EstimateRideParams): ResultFuture<RideOptions> {
    return this.rideRepository.estimateRide(params);
  }
}

export interface EstimateRideParams {
  customer_id: number;
  origin: string;
  destination: string;
}
