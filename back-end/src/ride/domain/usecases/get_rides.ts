import { UseCaseWithParams } from "../../../core/usecases/usecases";
import { RideRepository } from "../repo/ride_repository";
import { Left, ResultFuture } from "../../../core/typedefs/result_future";
import { RidesResponse } from "../entities/ride";
import { Failure } from "../../../core/errors/failure";

export class GetRides extends UseCaseWithParams<RidesResponse, GetRidesParams> {
  constructor(private readonly rideRepository: RideRepository) {
    super();
  }

  async call(params: GetRidesParams): ResultFuture<RidesResponse> {
    if (!params.customer_id) {
      return new Left(
        new Failure({
          error_code: "INVALID_DATA",
          error_description: "O id do cliente é obrigatório para buscar as corridas",
          status_code: 400,
        })
      );
    }
    return this.rideRepository.getRides(params);
  }
}

export interface GetRidesParams {
  customer_id: string;
  driver_id: number | undefined;
}
