import { ServerException } from "../../../core/errors/exception";
import { Failure } from "../../../core/errors/failure";
import { Left, ResultFuture, Right } from "../../../core/typedefs/result_future";
import { Driver } from "../../domain/entities/driver";
import { RideRepository } from "../../domain/repo/ride_repository";
import { RideDataSource } from "../datasource/ride_data_source";

export class RideRepositoryImpl implements RideRepository {
  constructor(datasource: RideDataSource) {
    this.datasource = datasource;
  }

  datasource: RideDataSource;

  async createDriver(params: Driver): ResultFuture<Driver> {
    try {
      await this.datasource.createDriver(params);
      return new Right(params);
    } catch (error) {
      if (error instanceof ServerException) {
        return new Left(new Failure({ error_code: error.errorCode, error_message: error.message, status_code: error.statusCode }));
      } else {
        throw error;
      }
    }
  }
}
