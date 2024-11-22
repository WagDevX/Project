import { PrismaClient } from "@prisma/client";
import { Driver } from "../../domain/entities/driver";
import { ServerException } from "../../../core/errors/exception";
import { Failure } from "../../../core/errors/failure";

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
      return await this.prismaClient.driver.create({ data: params });
    } catch (error) {
      throw new ServerException(error?.toString() ?? "Unknown error", 400, "CREATE_DRIVER_ERROR");
    }
  }
}
