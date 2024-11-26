import express, { Router } from "express";
import { anything, instance, mock, verify, when, match, jsonContaining, strictEqual } from "@johanblumenberg/ts-mockito";
import { ConfirmRide } from "../../../../ride/domain/usecases/confirm_ride";
import { CreateDriver } from "../../../../ride/domain/usecases/create_driver";
import { EstimateRide } from "../../../../ride/domain/usecases/estimate_ride";
import { GetRides } from "../../../../ride/domain/usecases/get_rides";
import RideRouter from "../../../../ride/presentation/router/ride_router";
import { Driver } from "../../../../ride/domain/entities/driver";
import { Left, Right } from "../../../../core/typedefs/result_future";
import supertest from "supertest";
import { Failure } from "../../../../core/errors/failure";
import { RideOptions, RidesResponse } from "../../../../ride/domain/entities/ride";

describe("ride router", () => {
  let rideRouterMock: RideRouter;
  let app: express.Application;
  let createDriver: CreateDriver;
  let estimateRide: EstimateRide;
  let confirmRide: ConfirmRide;
  let getRides: GetRides;

  beforeEach(() => {
    createDriver = mock(CreateDriver);
    estimateRide = mock(EstimateRide);
    confirmRide = mock(ConfirmRide);
    getRides = mock(GetRides);
    rideRouterMock = new RideRouter(instance(createDriver), instance(estimateRide), instance(confirmRide), instance(getRides));
    app = express();
    app.use(express.json());
    app.use("/ride", rideRouterMock.getRouter());
  });

  describe("PATCH /confirm", () => {
    it("should successfully call confirmRideUseCase and return a Right.value", async () => {
      // Arrange
      const params = {
        ride_id: "ride_id",
        driver_id: "driver_id",
      };

      when(confirmRide.call(anything())).thenResolve(new Right(undefined));

      // Act
      const response = await supertest(app).patch("/ride/confirm").send(params);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      verify(confirmRide.call(anything())).once();
    });

    it("should return a Failure when confirmRideUseCase returns a Left.value", async () => {
      // Arrange
      const failure = {
        error_code: "ERROR_CODE",
        error_description: "error",
      };

      when(confirmRide.call(anything())).thenResolve(
        new Left(
          new Failure({
            status_code: 400,
            error_code: "ERROR_CODE",
            error_description: "error",
          })
        )
      );

      // Act
      const response = await supertest(app).patch("/ride/confirm").send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual(failure);
      verify(confirmRide.call(anything())).once();
    });
  });

  describe("GET /:customer_id?driver_id", () => {
    it("should successfully call getRidesUseCase and return a Right.value", async () => {
      // Arrange
      const params = {
        customer_id: "customer_id",
        driver_id: "driver_id",
      };

      const ridesResponse: RidesResponse = {
        customer_id: "",
        rides: [],
      };

      when(getRides.call(anything())).thenResolve(new Right(ridesResponse));

      // Act
      const response = await supertest(app).get("/ride/customer_id?driver_id=driver_id");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(ridesResponse);
      verify(getRides.call(anything())).once();
    });

    it("should return a Failure when getRidesUseCase returns a Left.value", async () => {
      // Arrange
      const failure = {
        error_code: "ERROR_CODE",
        error_description: "error",
      };

      when(getRides.call(anything())).thenResolve(
        new Left(
          new Failure({
            status_code: 400,
            error_code: "ERROR_CODE",
            error_description: "error",
          })
        )
      );

      // Act
      const response = await supertest(app).get("/ride/customer_id?driver_id=driver_id");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual(failure);
      verify(getRides.call(anything())).once();
    });
  });

  describe("POST /estimate", () => {
    it("should successfully call estimateRideUseCase and return a Right.value", async () => {
      // Arrange
      const params = {
        origin: "origin",
        destination: "destination",
      };

      const rideOptions: RideOptions = {
        origin: {
          latitude: 0,
          longitude: 0,
        },
        destination: {
          latitude: 0,
          longitude: 0,
        },
        distance: 0,
        duration: "",
        options: [],
        routeResponse: {},
      };

      when(estimateRide.call(anything())).thenResolve(new Right(rideOptions));

      // Act
      const response = await supertest(app).post("/ride/estimate").send(params);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(rideOptions);
      verify(estimateRide.call(anything())).once();
    });

    it("should return a Failure when estimateRideUseCase returns a Left.value", async () => {
      // Arrange
      const failure = {
        error_code: "ERROR_CODE",
        error_description: "error",
      };

      when(estimateRide.call(anything())).thenResolve(
        new Left(
          new Failure({
            status_code: 400,
            error_code: "ERROR_CODE",
            error_description: "error",
          })
        )
      );

      // Act
      const response = await supertest(app).post("/ride/estimate").send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual(failure);
      verify(estimateRide.call(anything())).once();
    });
  });

  describe("POST /create-driver", () => {
    it("should successfully call createDriverUseCase and return a Right.value", async () => {
      // Arrange
      const params: Driver = {
        name: "name",
        description: "",
        car: "",
        tax: 0,
        minKm: 0,
        review: undefined,
        rides: [],
      };

      when(createDriver.call(anything())).thenResolve(new Right(params));

      // Act
      const response = await supertest(app).post("/ride/create-driver").send(params);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(params);
      verify(createDriver.call(anything())).once();
    });
  });

  it("should return a Failure when createDriverUseCase returns a Left.value", async () => {
    // Arrange
    const failure = {
      error_code: "ERROR_CODE",
      error_description: "error",
    };

    when(createDriver.call(anything())).thenResolve(
      new Left(
        new Failure({
          status_code: 400,
          error_code: "ERROR_CODE",
          error_description: "error",
        })
      )
    );

    // Act
    const response = await supertest(app).post("/ride/create-driver").send({});

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual(failure);
    verify(createDriver.call(anything())).once();
  });
});
