import { RideDataSourceImpl } from "../../data/datasource/ride_data_source";
import { RideRepositoryImpl } from "../../data/repo/ride_repo_impl";
import { CreateDriver } from "../../domain/usecases/create_driver";
import { EstimateRide } from "../../domain/usecases/estimate_ride";
import RideRouter from "../router/ride_router";

import { Client } from "@googlemaps/google-maps-services-js";
import { ConfirmRide } from "../../domain/usecases/confirm_ride";
import { GetRides } from "../../domain/usecases/get_rides";
import { MapsDataSourceImpl } from "../../data/datasource/maps_data_source";
import { PrismaClient } from "@prisma/client";

const routingClient = new Client();

const prismaClient = {
  prisma: new PrismaClient(),
};

const mapsDataSource = new MapsDataSourceImpl({ routingClient });

export const rideMiddleware = RideRouter(
  new CreateDriver(new RideRepositoryImpl(new RideDataSourceImpl({ prismaClient, mapsDataSource }))),
  new EstimateRide(new RideRepositoryImpl(new RideDataSourceImpl({ prismaClient, mapsDataSource }))),
  new ConfirmRide(new RideRepositoryImpl(new RideDataSourceImpl({ prismaClient, mapsDataSource }))),
  new GetRides(new RideRepositoryImpl(new RideDataSourceImpl({ prismaClient, mapsDataSource })))
);
