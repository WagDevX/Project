import { instance, mock, when, verify, _ } from "@johanblumenberg/ts-mockito";
import { RideDataSource } from "../../../../ride/data/datasource/ride_data_source";
import { RideRepositoryImpl } from "../../../../ride/data/repo/ride_repo_impl";
import { GetRidesParams } from "../../../../ride/domain/usecases/get_rides";
import { RideOptions, RidesResponse } from "../../../../ride/domain/entities/ride";
import { ServerException } from "../../../../core/errors/exception";
import { Failure } from "../../../../core/errors/failure";
import { Driver } from "../../../../ride/domain/entities/driver";
import { ConfirmRideParams } from "../../../../ride/domain/usecases/confirm_ride";
import { EstimateRideParams } from "../../../../ride/domain/usecases/estimate_ride";

describe("rideRepoImpl", () => {
  let mockRideDataSrc: RideDataSource;
  let rideRepoImpl: RideRepositoryImpl;

  beforeAll(() => {
    mockRideDataSrc = mock(RideDataSource);
    rideRepoImpl = new RideRepositoryImpl(instance(mockRideDataSrc));
  });

  describe("estimateRide", () => {
    it("should call the datasource and return a RideOptions", async () => {
      //Arrange
      const params: EstimateRideParams = {
        customer_id: "",
        origin: "",
        destination: "",
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

      when(mockRideDataSrc.estimateRide(params)).thenResolve(rideOptions);

      //Act
      const result = await rideRepoImpl.estimateRide(params);

      //Assert
      expect(result.isRight()).toBeTruthy();
      expect(result.value).toEqual(rideOptions);
      verify(mockRideDataSrc.estimateRide(params)).once();
    });

    it("should return a left with an Failure if datasource throws an ServerException", async () => {
      //Arrange
      const params: EstimateRideParams = {
        customer_id: "",
        origin: "",
        destination: "",
      };

      when(mockRideDataSrc.estimateRide(params)).thenReject(new ServerException("Error", 400, "ERROR_CODE"));

      //Act
      const result = await rideRepoImpl.estimateRide(params);

      //Assert
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toEqual(
        new Failure({
          error_description: "Error",
          error_code: "ERROR_CODE",
          status_code: 400,
        })
      );
      verify(mockRideDataSrc.estimateRide(params)).once();
    });

    it("should return a left with an Failure if datasource throws an Error", async () => {
      //Arrange
      const params: EstimateRideParams = {
        customer_id: "",
        origin: "",
        destination: "",
      };

      when(mockRideDataSrc.estimateRide(params)).thenReject(new Error("Error"));

      //Act
      const result = await rideRepoImpl.estimateRide(params);

      //Assert
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toEqual(
        new Failure({
          error_description: "Internal Server Error",
          error_code: "INTERNAL_SERVER_ERROR",
          status_code: 500,
        })
      );
      verify(mockRideDataSrc.estimateRide(params)).once();
    });
  });

  describe("confirmRide", () => {
    it("should call the datasource and return a void", async () => {
      //Arrange
      const params: ConfirmRideParams = {
        customer_id: "test",
        origin: "",
        destination: "",
        distance: 0,
        duration: "",
        driver: {
          id: 0,
          name: "",
        },
        value: 0,
      };

      when(mockRideDataSrc.confirmRide(params)).thenResolve();

      //Act
      const result = await rideRepoImpl.confirmRide(params);

      //Assert
      expect(result.isRight()).toBeTruthy();
      expect(result.value).toEqual(undefined);
      verify(mockRideDataSrc.confirmRide(params)).once();
    });

    it("should return a left with an Failure if datasource throws an ServerException", async () => {
      //Arrange
      const params: ConfirmRideParams = {
        customer_id: "test",
        origin: "",
        destination: "",
        distance: 0,
        duration: "",
        driver: {
          id: 0,
          name: "",
        },
        value: 0,
      };

      when(mockRideDataSrc.confirmRide(params)).thenReject(new ServerException("Error", 400, "ERROR_CODE"));

      //Act
      const result = await rideRepoImpl.confirmRide(params);

      //Assert
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toEqual(
        new Failure({
          error_description: "Error",
          error_code: "ERROR_CODE",
          status_code: 400,
        })
      );
      verify(mockRideDataSrc.confirmRide(params)).once();
    });

    it("should return a left with an Failure if datasource throws an Error", async () => {
      //Arrange
      const params: ConfirmRideParams = {
        customer_id: "test",
        origin: "",
        destination: "",
        distance: 0,
        duration: "",
        driver: {
          id: 0,
          name: "",
        },
        value: 0,
      };

      when(mockRideDataSrc.confirmRide(params)).thenReject(new Error("Error"));

      //Act
      const result = await rideRepoImpl.confirmRide(params);

      //Assert
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toEqual(
        new Failure({
          error_description: "Internal Server Error",
          error_code: "INTERNAL_SERVER_ERROR",
          status_code: 500,
        })
      );
      verify(mockRideDataSrc.confirmRide(params)).once();
    });
  });

  describe("createDriver", () => {
    it("should call the datasource and return the driver", async () => {
      //Arrange
      const params: Driver = {
        name: "test",
        id: 0,
        description: "",
        car: "",
        tax: 0,
        minKm: 0,
        review: undefined,
        rides: [],
      };

      when(mockRideDataSrc.createDriver(params)).thenResolve(params);

      //Act
      const result = await rideRepoImpl.createDriver(params);

      //Assert
      expect(result.isRight()).toBeTruthy();
      expect(result.value).toEqual(params);
      verify(mockRideDataSrc.createDriver(params)).once();
    });

    it("should return a left with an Failure if datasource throws an ServerException", async () => {
      //Arrange
      const params: Driver = {
        name: "test",
        id: 0,
        description: "",
        car: "",
        tax: 0,
        minKm: 0,
        review: undefined,
        rides: [],
      };

      when(mockRideDataSrc.createDriver(params)).thenReject(new ServerException("Error", 400, "ERROR_CODE"));

      //Act
      const result = await rideRepoImpl.createDriver(params);

      //Assert
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toEqual(
        new Failure({
          error_description: "Error",
          error_code: "ERROR_CODE",
          status_code: 400,
        })
      );
      verify(mockRideDataSrc.createDriver(params)).once();
    });

    it("should return a left with an Failure if datasource throws an Error", async () => {
      //Arrange
      const params: Driver = {
        name: "test",
        id: 0,
        description: "",
        car: "",
        tax: 0,
        minKm: 0,
        review: undefined,
        rides: [],
      };

      when(mockRideDataSrc.createDriver(params)).thenReject(new Error("Error"));

      //Act
      const result = await rideRepoImpl.createDriver(params);

      //Assert
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toEqual(
        new Failure({
          error_description: "Internal Server Error",
          error_code: "INTERNAL_SERVER_ERROR",
          status_code: 500,
        })
      );
      verify(mockRideDataSrc.createDriver(params)).once();
    });
  });

  describe("getRides", () => {
    it("should call the datasource and return ridesResponse", async () => {
      //Arrange
      const params: GetRidesParams = {
        customer_id: "1",
        driver_id: undefined,
      };

      const ridesReponse: RidesResponse = {
        customer_id: "",
        rides: [],
      };

      when(mockRideDataSrc.getRides(params)).thenResolve(ridesReponse);

      //Act
      const result = await rideRepoImpl.getRides(params);

      //Assert
      expect(result.isRight()).toBeTruthy();
      expect(result.value).toEqual(ridesReponse);
      verify(mockRideDataSrc.getRides(params)).once();
    });

    it("should return a left with an Failure if datasource throws an ServerException", async () => {
      //Arrange
      const params: GetRidesParams = {
        customer_id: "1",
        driver_id: undefined,
      };

      when(mockRideDataSrc.getRides(params)).thenReject(new ServerException("Error", 400, "ERROR_CODE"));

      //Act
      const result = await rideRepoImpl.getRides(params);

      //Assert
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toEqual(
        new Failure({
          error_description: "Error",
          error_code: "ERROR_CODE",
          status_code: 400,
        })
      );
      verify(mockRideDataSrc.getRides(params)).once();
    });

    it("should return a left with an Failure if datasource throws an Error", async () => {
      //Arrange
      const params: GetRidesParams = {
        customer_id: "1",
        driver_id: undefined,
      };

      when(mockRideDataSrc.getRides(params)).thenReject(new Error("Error"));

      //Act
      const result = await rideRepoImpl.getRides(params);

      //Assert
      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toEqual(
        new Failure({
          error_description: "Internal Server Error",
          error_code: "INTERNAL_SERVER_ERROR",
          status_code: 500,
        })
      );
      verify(mockRideDataSrc.getRides(params)).once();
    });
  });
});
