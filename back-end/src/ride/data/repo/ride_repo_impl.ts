import { ServerException } from "../../../core/errors/exception";
import { Failure } from "../../../core/errors/failure";
import {
  Left,
  ResultFuture,
  Right,
} from "../../../core/typedefs/result_future";
import { Driver } from "../../domain/entities/driver";
import { RideOptions } from "../../domain/entities/ride";
import { RideRepository } from "../../domain/repo/ride_repository";
import { EstimateRideParams } from "../../domain/usecases/estimate_ride";
import { RideDataSource } from "../datasource/ride_data_source";

export class RideRepositoryImpl implements RideRepository {
  constructor(datasource: RideDataSource) {
    this.datasource = datasource;
  }

  estimateRide(params: EstimateRideParams): ResultFuture<RideOptions> {
    throw new Error("Method not implemented.");
  }

  datasource: RideDataSource;

  async createDriver(params: Driver): ResultFuture<Driver> {
    try {
      const result = await this.datasource.createDriver(params);
      return new Right(result);
    } catch (error) {
      if (error instanceof ServerException) {
        return new Left(
          new Failure({
            error_code: error.errorCode,
            error_description: error.message,
            status_code: error.statusCode,
          })
        );
      } else {
        throw error;
      }
    }
  }
}
