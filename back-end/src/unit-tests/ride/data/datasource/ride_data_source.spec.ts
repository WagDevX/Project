import { PrismaClient, PrismaPromise } from "@prisma/client";
import { RideDataSourceImpl } from "../../../../ride/data/datasource/ride_data_source";
import { mock, instance, when, anything } from "@johanblumenberg/ts-mockito";
import { MapsDataSource } from "../../../../ride/data/datasource/maps_data_source";
import { RidesResponse } from "../../../../ride/domain/entities/ride";
import { GetRidesParams } from "../../../../ride/domain/usecases/get_rides";
import { Context, createMockContext, MockContext } from "../../../context/context";

describe("ride_data_source", () => {
  let mapsDataSourceMock: MapsDataSource;
  let rideDataSourceImpl: RideDataSourceImpl;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(() => {
    mapsDataSourceMock = mock(MapsDataSource);
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    rideDataSourceImpl = new RideDataSourceImpl({ prismaClient: mockCtx, mapsDataSource: mapsDataSourceMock });
  });

  describe("getRides", () => {
    it("should return rides", async () => {
      // Arrange
      const rides: RidesResponse = {
        customer_id: "test",
        rides: [
          {
            driver: {
              id: 1,
              name: "test name",
            },
            date: new Date(),
            origin: "test origin",
            destination: "test destination",
            distance: 0,
            duration: "test duration",
            value: 0,
          },
        ],
      };

      const params: GetRidesParams = {
        customer_id: "test",
        driver_id: 1,
      };

      const ridesPrism: Array<{
        driver: {
          name: string;
        };
        id: number;
        driverId: number;
        date: Date;
        origin: string;
        destination: string;
        distance: number;
        duration: string;
        customerId: string;
        value: number;
      }> = [
        {
          driver: {
            name: "test name",
          },
          id: 1,
          driverId: 1,
          date: new Date(),
          origin: "test origin",
          destination: "test destination",
          distance: 0,
          duration: "test duration",
          customerId: "test",
          value: 0,
        },
      ];

      const driver = {
        id: 1,

        description: "test description",

        name: "test name",

        car: "test car",

        tax: 0,

        minKm: 0,
      };

      mockCtx.prisma.driver.findUnique.mockResolvedValue(driver);

      mockCtx.prisma.ride.findMany.mockResolvedValue(ridesPrism);

      // Act
      const result = await rideDataSourceImpl.getRides(params);

      // Assert
      expect(result).toEqual(rides);
    });
  });

  it("should throw an ServeException if driver is not found", async () => {
    // Arrange
    const params: GetRidesParams = {
      customer_id: "test",
      driver_id: 1,
    };

    mockCtx.prisma.driver.findUnique.mockResolvedValue(null);

    // Act
    await expect(rideDataSourceImpl.getRides(params)).rejects.toThrow("Motorista inválido");
  });

  it("should throw an ServeException if no rides are found", async () => {
    // Arrange
    const params: GetRidesParams = {
      customer_id: "test",
      driver_id: 1,
    };

    const driver = {
      id: 1,

      description: "test description",

      name: "test name",

      car: "test car",

      tax: 0,

      minKm: 0,
    };

    mockCtx.prisma.driver.findUnique.mockResolvedValue(driver);

    mockCtx.prisma.ride.findMany.mockResolvedValue([]);

    // Act
    await expect(rideDataSourceImpl.getRides(params)).rejects.toThrow("Nenhum registro encontrado");
  });

  it("should throw an ServeException if an error occurs", async () => {
    // Arrange
    const params: GetRidesParams = {
      customer_id: "test",
      driver_id: 1,
    };

    const driver = {
      id: 1,

      description: "test description",

      name: "test name",

      car: "test car",

      tax: 0,

      minKm: 0,
    };

    mockCtx.prisma.driver.findUnique.mockResolvedValue(driver);

    mockCtx.prisma.ride.findMany.mockRejectedValue(new Error("test error"));

    // Act
    await expect(rideDataSourceImpl.getRides(params)).rejects.toThrow("test error");
  });
});
