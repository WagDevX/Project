import { RideDataSourceImpl } from "../../data/datasource/ride_data_source";
import { RideRepositoryImpl } from "../../data/repo/ride_repo_impl";
import { CreateDriver } from "../../domain/usecases/create_driver";
import { EstimateRide } from "../../domain/usecases/estimate_ride";
import RideRouter from "../router/ride_router";
import { PrismaClient } from "@prisma/client";

import { Client } from "@googlemaps/google-maps-services-js";

const routingClient = new Client();

const prismaClient = new PrismaClient();

export const rideMiddleware = RideRouter(
  new CreateDriver(
    new RideRepositoryImpl(
      new RideDataSourceImpl({ prismaClient, routingClient })
    )
  ),
  new EstimateRide(
    new RideRepositoryImpl(
      new RideDataSourceImpl({ prismaClient, routingClient })
    )
  )
);
