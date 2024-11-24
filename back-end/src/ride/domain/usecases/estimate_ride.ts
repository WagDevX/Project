import { Failure } from "../../../core/errors/failure";
import { Left, ResultFuture } from "../../../core/typedefs/result_future";
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
  async call(params: EstimateRideParams): ResultFuture<RideOptions> {
    if (!params.origin || !params.destination) {
      return new Left(
        new Failure({
          error_code: "INVALID_DATA",
          error_description:
            "Os dados fornecidos no corpo da requisição são inválidos ",
          status_code: 400,
        })
      );
    }

    if (params.customer_id === undefined || params.customer_id === null) {
      return new Left(
        new Failure({
          error_code: "INVALID_DATA",
          error_description:
            "Os dados fornecidos no corpo da requisição são inválidos ",
          status_code: 400,
        })
      );
    }

    if (params.origin === params.destination) {
      return new Left(
        new Failure({
          error_code: "INVALID_DATA",
          error_description:
            "Os dados fornecidos no corpo da requisição são inválidos.",
          status_code: 400,
        })
      );
    }

    return this.rideRepository.estimateRide(params);
  }
}

export interface EstimateRideParams {
  customer_id: number;
  origin: string;
  destination: string;
}
