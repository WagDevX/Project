import { instance, mock, when, verify, _ } from "@johanblumenberg/ts-mockito";
import { RideRepository } from "../../../../ride/domain/repo/ride_repository";
import { EstimateRide } from "../../../../ride/domain/usecases/estimate_ride";
import { RideOptions } from "../../../../ride/domain/entities/ride";
import { Left, Right } from "../../../../core/typedefs/result_future";
import { Failure } from "../../../../core/errors/failure";

describe("estimateRideUseCase", () => {
  let mockRideRepositoru: RideRepository;
  let usecase: EstimateRide;

  beforeAll(() => {
    mockRideRepositoru = mock(RideRepository);
    usecase = new EstimateRide(instance(mockRideRepositoru));
  });

  it("should return a Right(RideOptions) if the data is valid", async () => {
    // Arrange
    const params = {
      customer_id: "1",
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

    when(mockRideRepositoru.estimateRide(params)).thenResolve(new Right(rideOptions));

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(rideOptions);
    verify(mockRideRepositoru.estimateRide(params)).once();
  });

  it("should return a Left(Failure) if origin is not provided", async () => {
    // Arrange
    const params = {
      customer_id: "1",
      origin: "",
      destination: "destination",
    };

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockRideRepositoru.estimateRide(params)).never();
  });

  it("should return a Left(Failure) if destination is not provided", async () => {
    // Arrange
    const params = {
      customer_id: "1",
      origin: "origin",
      destination: "",
    };

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockRideRepositoru.estimateRide(params)).never();
  });

  it("should return a Left(Failure) if customer_id is not provided", async () => {
    // Arrange
    const params = {
      customer_id: "",
      origin: "origin",
      destination: "destination",
    };

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockRideRepositoru.estimateRide(params)).never();
  });

  it("should return a Left(Failure) if the data is invalid", async () => {
    // Arrange
    const params = {
      customer_id: "1",
      origin: "origin",
      destination: "destination",
    };

    when(mockRideRepositoru.estimateRide(params)).thenResolve(
      new Left(
        new Failure({
          error_code: "INVALID_DATA",
          error_description: "Os dados fornecidos no corpo da requisição são inválidos",
          status_code: 400,
        })
      )
    );

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockRideRepositoru.estimateRide(params)).once();
  });
});
