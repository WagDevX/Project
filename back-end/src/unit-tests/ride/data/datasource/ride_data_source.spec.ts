import { PrismaClient } from "@prisma/client";
import { RideDataSourceImpl } from "../../../../ride/data/datasource/ride_data_source";
import { mock, instance } from "@johanblumenberg/ts-mockito";
import { MapsDataSource } from "../../../../ride/data/datasource/maps_data_source";

describe("ride_data_source", () => {
  let prismaClient: PrismaClient;
  let mapsDataSourceMock: MapsDataSource;
  let rideDataSourceImpl: RideDataSourceImpl;

  beforeEach(() => {
    prismaClient = mock(PrismaClient);
    mapsDataSourceMock = mock(MapsDataSource);
    rideDataSourceImpl = new RideDataSourceImpl({ prismaClient: instance(prismaClient), mapsDataSource: mapsDataSourceMock });
  });

  describe("getRides", () => {
    it("should return rides", async () => {});
  });
});
