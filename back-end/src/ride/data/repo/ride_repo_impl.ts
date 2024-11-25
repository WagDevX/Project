import { ServerException } from "../../../core/errors/exception";
import { Failure } from "../../../core/errors/failure";
import { Left, ResultFuture, Right } from "../../../core/typedefs/result_future";
import { Driver } from "../../domain/entities/driver";
import { RideOptions, RidesResponse } from "../../domain/entities/ride";
import { RideRepository } from "../../domain/repo/ride_repository";
import { ConfirmRideParams } from "../../domain/usecases/confirm_ride";
import { EstimateRideParams } from "../../domain/usecases/estimate_ride";
import { GetRidesParams } from "../../domain/usecases/get_rides";
import { RideDataSource } from "../datasource/ride_data_source";

export class RideRepositoryImpl implements RideRepository {
  constructor(datasource: RideDataSource) {
    this.datasource = datasource;
  }
  async getRides(params: GetRidesParams): ResultFuture<RidesResponse> {
    try {
      const result = await this.datasource.getRides(params);
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
        return new Left(
          new Failure({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: "Internal Server Error",
            status_code: 500,
          })
        );
      }
    }
  }

  async confirmRide(params: ConfirmRideParams): ResultFuture<void> {
    try {
      await this.datasource.confirmRide(params);
      return new Right(undefined);
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
        return new Left(
          new Failure({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: "Internal Server Error",
            status_code: 500,
          })
        );
      }
    }
  }

  async estimateRide(params: EstimateRideParams): ResultFuture<RideOptions> {
    try {
      const result = await this.datasource.estimateRide(params);
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
        return new Left(
          new Failure({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: "Internal Server Error",
            status_code: 500,
          })
        );
      }
    }
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
        return new Left(
          new Failure({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: "Internal Server Error",
            status_code: 500,
          })
        );
      }
    }
  }
}
