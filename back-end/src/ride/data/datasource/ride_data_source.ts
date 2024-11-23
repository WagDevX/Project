import { PrismaClient } from "@prisma/client";
import { Driver } from "../../domain/entities/driver";
import { ServerException } from "../../../core/errors/exception";

export abstract class RideDataSource {
  abstract createDriver(params: Driver): Promise<Driver>;
}

export class RideDataSourceImpl extends RideDataSource {
  prismaClient: PrismaClient;
  constructor({ prismaClient }: { prismaClient: PrismaClient }) {
    super();
    this.prismaClient = prismaClient;
  }

  async createDriver(params: Driver): Promise<Driver> {
    try {
      const result = await this.prismaClient.driver.create({
        data: {
          description: params.description,
          name: params.name,
          car: params.car,
          tax: params.tax,
          minKm: params.minKm,
        },
      });
      console.log(result);

      const driverCreated: Driver = {
        ...result,
        id: result.id,
        review: undefined,
        rides: [],
      };

      console.log(driverCreated);

      return driverCreated;
    } catch (error) {
      throw new ServerException(
        error?.toString() ?? "Unknown error",
        400,
        "CREATE_DRIVER_ERROR"
      );
    }
  }
}
