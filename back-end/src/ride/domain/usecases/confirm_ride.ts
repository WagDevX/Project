import { UseCaseWithParams } from "../../../core/usecases/usecases";
import { RideRepository } from "../repo/ride_repository";
import { Left, ResultFuture } from "../../../core/typedefs/result_future";
import { Failure } from "../../../core/errors/failure";

export class ConfirmRide extends UseCaseWithParams<void, ConfirmRideParams> {
  constructor(private readonly rideRepository: RideRepository) {
    super();
  }
  async call(params: ConfirmRideParams): ResultFuture<void> {
    const { origin, destination, customer_id } = params;

    if (
      !origin.trim() ||
      !destination.trim() ||
      !customer_id.trim() ||
      origin === destination
    ) {
      return new Left(
        new Failure({
          error_code: "INVALID_DATA",
          error_description:
            "Os dados fornecidos no corpo da requisição são inválidos",
          status_code: 400,
        })
      );
    }

    return await this.rideRepository.confirmRide(params);
  }
}

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
