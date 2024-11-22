import { Failure } from "../../../core/errors/failure";
import { Left, ResultFuture } from "../../../core/typedefs/result_future";
import { UseCaseWithParams } from "../../../core/usecases/usecases";
import { Driver } from "../entities/driver";
import { RideRepository } from "../repo/ride_repository";

export class CreateDriver extends UseCaseWithParams<Driver, Driver> {
  constructor(private readonly driverRepository: RideRepository) {
    super();
  }
  async call(params: Driver): ResultFuture<Driver> {
    if (!params.name) {
      return new Left(new Failure({ error_code: "INVALID_PARAMS", error_message: "Name is required", status_code: 400 }));
    }
    return await this.driverRepository.createDriver(params);
  }
}
