import { PrismaClient, PrismaPromise } from "@prisma/client";
import { RideDataSourceImpl } from "../../../../ride/data/datasource/ride_data_source";
import { mock, instance, when, anything } from "@johanblumenberg/ts-mockito";
import { MapsDataSource } from "../../../../ride/data/datasource/maps_data_source";
import { RidesResponse } from "../../../../ride/domain/entities/ride";
import { GetRidesParams } from "../../../../ride/domain/usecases/get_rides";
import { Context, createMockContext, MockContext } from "../../../context/context";
import { AxiosRequestHeaders } from "axios";
import { DirectionsResponse, DirectionsResponseData, Status } from "@googlemaps/google-maps-services-js";
import { ServerException } from "../../../../core/errors/exception";

describe("ride_data_source", () => {
  let mapsDataSourceMock: MapsDataSource;
  let rideDataSourceImpl: RideDataSourceImpl;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(() => {
    mapsDataSourceMock = mock(MapsDataSource);
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    rideDataSourceImpl = new RideDataSourceImpl({ prismaClient: mockCtx, mapsDataSource: instance(mapsDataSourceMock) });
  });

  describe("estimateRide", () => {
    it("should estimate ride successfully", async () => {
      // Arrange
      const params = {
        customer_id: "test",
        origin: "test origin",
        destination: "test destination",
      };

      const fixedDate = new Date("2023-01-01T00:00:00Z");

      const directionsResponse: DirectionsResponse = {
        data: {
          geocoded_waypoints: [],
          routes: [
            {
              bounds: {
                northeast: { lat: 1, lng: 1 },
                southwest: { lat: 2, lng: 2 },
              },
              legs: [
                {
                  distance: { value: 1000, text: "1 km" },
                  duration: { text: "10 mins", value: 600 },
                  steps: [],
                  arrival_time: {
                    text: "",
                    time_zone: "",
                    value: fixedDate,
                  },
                  departure_time: { text: "", time_zone: "", value: fixedDate },
                  start_location: { lat: 1, lng: 1 },
                  end_location: { lat: 2, lng: 2 },
                  start_address: "test start address",
                  end_address: "test end address",
                },
              ],
              summary: "test summary",
              waypoint_order: [],
              overview_polyline: { points: "test points" },
              copyrights: "test copyrights",
              warnings: [],
              fare: { currency: "USD", value: 10, text: "$10" },
              overview_path: [{ lat: 1, lng: 1 }],
            },
          ],
          available_travel_modes: [],
          status: Status.OK,
          error_message: "",
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {
          headers: {} as AxiosRequestHeaders,
        },
      };

      const driverOptions = [
        {
          id: 1,
          name: "test name",
          description: "test description",
          car: "test car",
          tax: 10,
          minKm: 2,
          review: { rating: 5, comment: "test comment" },
        },
      ];

      when(mapsDataSourceMock.getRouteInfo(anything())).thenResolve(directionsResponse);
      mockCtx.prisma.driver.findMany.mockResolvedValue(driverOptions);

      // Act
      const result = await rideDataSourceImpl.estimateRide(params);

      // Assert
      expect(result).toEqual({
        origin: { latitude: 1, longitude: 1 },
        destination: { latitude: 2, longitude: 2 },
        distance: 1000,
        duration: "10 mins",
        options: [
          {
            id: 1,
            name: "test name",
            description: "test description",
            vehicle: "test car",
            review: { rating: 5, comment: "test comment" },
            value: 10,
          },
        ],
        routeResponse: {
          available_travel_modes: [],
          error_message: "",
          geocoded_waypoints: [],
          routes: [
            {
              bounds: {
                northeast: { lat: 1, lng: 1 },
                southwest: { lat: 2, lng: 2 },
              },
              legs: [
                {
                  distance: { value: 1000, text: "1 km" },
                  duration: { text: "10 mins", value: 600 },
                  steps: [],
                  arrival_time: {
                    text: "",
                    time_zone: "",
                    value: fixedDate,
                  },
                  departure_time: { text: "", time_zone: "", value: fixedDate },
                  start_location: { lat: 1, lng: 1 },
                  end_location: { lat: 2, lng: 2 },
                  start_address: "test start address",
                  end_address: "test end address",
                },
              ],
              summary: "test summary",
              waypoint_order: [],
              overview_polyline: { points: "test points" },
              copyrights: "test copyrights",
              warnings: [],
              fare: { currency: "USD", value: 10, text: "$10" },
              overview_path: [{ lat: 1, lng: 1 }],
            },
          ],
          status: "OK",
        },
      });
    });

    it("should throw an ServerException if an error occurs", async () => {
      // Arrange
      const params = {
        customer_id: "test",
        origin: "test origin",
        destination: "test destination",
      };

      when(mapsDataSourceMock.getRouteInfo(anything())).thenReject(new Error("test error"));

      // Act & Assert
      await expect(rideDataSourceImpl.estimateRide(params)).rejects.toThrow("Erro ao estimar a corrida, verifique os dados informados e tente novamente");
    });
  });

  describe("createDriver", () => {
    it("should create driver successfully", async () => {
      // Arrange
      const params = {
        description: "test description",
        name: "test name",
        car: "test car",
        tax: 0,
        minKm: 2,
        review: null,
        rides: [] as any,
      };

      const created = {
        id: 1,
        description: "test description",
        name: "test name",
        car: "test car",
        tax: 0,
        minKm: 2,
      };

      mockCtx.prisma.driver.create.mockResolvedValue(created);

      // Act
      const result = await rideDataSourceImpl.createDriver(params);

      // Assert
      expect(result).toEqual({ ...created, review: undefined, rides: [] });
      expect(mockCtx.prisma.driver.create).toHaveBeenCalledWith({
        data: {
          description: params.description,
          name: params.name,
          car: params.car,
          tax: params.tax,
          minKm: params.minKm,
        },
      });
    });

    it("should throw an ServerException if an error occurs", async () => {
      // Arrange
      const params = {
        description: "test description",
        name: "test name",
        car: "test car",
        tax: 0,
        minKm: 2,
        review: null,
        rides: [] as any,
      };

      mockCtx.prisma.driver.create.mockRejectedValue(new Error("test error"));

      // Act & Assert
      await expect(rideDataSourceImpl.createDriver(params)).rejects.toThrow("test error");
    });
  });

  describe("confirmRide", () => {
    it("should confirm ride successfully", async () => {
      // Arrange
      const params = {
        customer_id: "test",
        driver: {
          id: 1,
          name: "test name",
        },
        origin: "test origin",
        destination: "test destination",
        distance: 1000,
        duration: "test duration",
        value: 100,
      };

      const created = {
        id: 1,

        date: new Date(),

        customerId: "test",

        driverId: 1,

        origin: "test origin",

        destination: "test destination",

        distance: 1000,

        duration: "test duration",

        value: 100,
      };

      const driver = {
        id: 1,

        description: "test description",

        name: "test name",

        car: "test car",

        tax: 0,

        minKm: 2,
      };

      mockCtx.prisma.driver.findUnique.mockResolvedValue(driver);

      mockCtx.prisma.ride.create.mockResolvedValue(created);

      // Act
      await rideDataSourceImpl.confirmRide(params);

      // Assert
      expect(mockCtx.prisma.ride.create).toHaveBeenCalledWith({
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
    });

    it("should throw an ServerException if driver is not found", async () => {
      // Arrange
      const params = {
        customer_id: "test",
        driver: {
          id: 1,
          name: "test name",
        },
        origin: "test origin",
        destination: "test destination",
        distance: 1000,
        duration: "test duration",
        value: 100,
      };

      mockCtx.prisma.driver.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(rideDataSourceImpl.confirmRide(params)).rejects.toThrow("Motorista não encontrado");
    });

    it("should throw an ServerException if distance is invalid for driver", async () => {
      // Arrange
      const params = {
        customer_id: "test",
        driver: {
          id: 1,
          name: "test name",
        },
        origin: "test origin",
        destination: "test destination",
        distance: 3000,
        duration: "test duration",
        value: 100,
      };

      const driver = {
        id: 1,
        description: "test description",
        name: "test name",
        car: "test car",
        tax: 0,
        minKm: 2,
      };

      mockCtx.prisma.driver.findUnique.mockResolvedValue(driver);

      // Act & Assert
      await expect(rideDataSourceImpl.confirmRide(params)).rejects.toThrow("Quilometragem inválida para o motorista");
    });

    it("should throw CREATE_RIDE_ERROR when an unknown error occurs", async () => {
      // Arrange
      const params = {
        customer_id: "test",
        driver: {
          id: 1,
          name: "test name",
        },
        origin: "test origin",
        destination: "test destination",
        distance: 3000,
        duration: "test duration",
        value: 100,
      };

      const driver = {
        id: 1,
        description: "test description",
        name: "test name",
        car: "test car",
        tax: 0,
        minKm: 5,
      };

      mockCtx.prisma.driver.findUnique.mockResolvedValue(driver);
      mockCtx.prisma.ride.create.mockRejectedValue(new Error("Unknown error"));

      try {
        await rideDataSourceImpl.confirmRide(params);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).message).toBe("Unknown error");
      }
    });
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

  it("should throw an ServeException if an error is thrown", async () => {
    // Arrange
    const params: GetRidesParams = {
      customer_id: "test",
      driver_id: 1,
    };

    mockCtx.prisma.driver.findUnique.mockRejectedValue(new Error("test error"));

    // Act
    try {
      await rideDataSourceImpl.getRides(params);
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(ServerException);
    }
  });
});
