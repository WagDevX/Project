import { PrismaClient } from "@prisma/client";
import { Driver } from "../../domain/entities/driver";
import { ServerException } from "../../../core/errors/exception";
import { EstimateRideParams } from "../../domain/usecases/estimate_ride";
import { DriverOption, RideOptions } from "../../domain/entities/ride";
require("dotenv").config();

import { Client } from "@googlemaps/google-maps-services-js";
import { ConfirmRideParams } from "../../domain/usecases/confirm_ride";

export abstract class RideDataSource {
  abstract createDriver(params: Driver): Promise<Driver>;
  abstract estimateRide(params: EstimateRideParams): Promise<RideOptions>;
  abstract confirmRide(params: ConfirmRideParams): Promise<void>;
}

export class RideDataSourceImpl extends RideDataSource {
  routingClient: Client;
  prismaClient: PrismaClient;
  constructor({
    prismaClient,
    routingClient,
  }: {
    prismaClient: PrismaClient;
    routingClient: Client;
  }) {
    super();
    this.prismaClient = prismaClient;
    this.routingClient = routingClient;
  }

  async confirmRide(params: ConfirmRideParams): Promise<void> {
    try {
      const driver = await this.prismaClient.driver.findUnique({
        where: { id: params.driver.id },
      });

      if (!driver) {
        throw new ServerException(
          "Motorista não encontrado",
          404,
          "DRIVER_NOT_FOUND"
        );
      }

      if (params.distance / 1000 > driver.minKm) {
        throw new ServerException(
          "Quilometragem inválida para o motorista",
          406,
          "INVALID_DISTANCE"
        );
      }
      await this.prismaClient.ride.create({
        data: {
          customerId: params.customer_id,
          driverId: params.driver.id,
          origin: params.origin,
          destination: params.destination,
          distance: params.distance,
          duration: params.duration,
          value: params.value,
        },
      });
    } catch (error) {
      if (error instanceof ServerException) {
        throw error;
      }
      throw new ServerException(
        error?.toString() ?? "Unknown error",
        400,
        "CREATE_RIDE_ERROR"
      );
    }
  }

  async estimateRide(params: EstimateRideParams): Promise<RideOptions> {
    const request = {
      origin: params.origin,
      destination: params.destination,
    };
    const routeResult = await this.routingClient.directions({
      params: {
        origin: request.origin,
        destination: request.destination,
        key: process.env.GOOGLE_API_KEY ?? "",
      },
      timeout: 1000,
    });

    const driverOptions = await this.prismaClient.driver.findMany({
      include: {
        review: true,
      },
      where: {
        minKm: {
          gte: routeResult.data.routes[0].legs[0].distance.value / 1000,
        },
      },
      orderBy: {
        tax: "asc",
      },
    });

    let options: DriverOption[] = [];

    driverOptions.forEach((driver) => {
      options.push({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.car,
        review: {
          rating: driver.review?.rating ?? 0,
          comment: driver.review?.comment ?? "",
        },
        value: parseFloat(
          (
            driver.tax *
            (routeResult.data.routes[0].legs[0].distance.value / 1000)
          ).toFixed(2)
        ),
      });
    });

    return {
      origin: {
        latitude: routeResult.data.routes[0].legs[0].start_location.lat,
        longitude: routeResult.data.routes[0].legs[0].start_location.lng,
      },
      destination: {
        latitude: routeResult.data.routes[0].legs[0].end_location.lat,
        longitude: routeResult.data.routes[0].legs[0].end_location.lng,
      },
      distance: routeResult.data.routes[0].legs[0].distance.value,
      duration: routeResult.data.routes[0].legs[0].duration.text,
      options: options,
      routeResponse: routeResult.data,
    };
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

      const driverCreated: Driver = {
        ...result,
        id: result.id,
        review: undefined,
        rides: [],
      };

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
