import { Driver } from "../../domain/entities/driver";

import { PrismaClient } from "@prisma/client";

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
    return params;
  }
}
