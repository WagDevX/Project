import { RideRepository } from "../../../../ride/domain/repo/ride_repository";
import { mock, instance, when, verify, _ } from "@johanblumenberg/ts-mockito";
import { ConfirmRide } from "../../../../ride/domain/usecases/confirm_ride";
import { Left, Right } from "../../../../core/typedefs/result_future";
import { Failure } from "../../../../core/errors/failure";

describe("confirmRideUseCase", () => {
  let mockRideRepository: RideRepository;
  let usecase: ConfirmRide;

  beforeEach(() => {
    mockRideRepository = mock(RideRepository);
    usecase = new ConfirmRide(instance(mockRideRepository));
  });

  it("should return a Left(Failure) if origin is equal to destination", async () => {
    // Arrange
    const params = {
      customer_id: "1",
      origin: "origin",
      destination: "origin",
      distance: 10,
      duration: "10min",
      driver: {
        id: 1,
        name: "driver",
      },
      value: 10,
    };

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockRideRepository.confirmRide(params)).never();
  });

  it("should return a Left(Failure) if destination is not provided", async () => {
    // Arrange
    const params = {
      customer_id: "1",
      origin: "origin",
      destination: "",
      distance: 10,
      duration: "10min",
      driver: {
        id: 1,
        name: "driver",
      },
      value: 10,
    };

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockRideRepository.confirmRide(params)).never();
  });

  it("should return a Left(Failure) if origin is not provided", async () => {
    // Arrange
    const params = {
      customer_id: "1",
      origin: "",
      destination: "destination",
      distance: 10,
      duration: "10min",
      driver: {
        id: 1,
        name: "driver",
      },
      value: 10,
    };

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockRideRepository.confirmRide(params)).never();
  });

  it("should return a Left(Failure) if customer_id is not provided", async () => {
    // Arrange
    const params = {
      customer_id: "",
      origin: "origin",
      destination: "destination",
      distance: 10,
      duration: "10min",
      driver: {
        id: 1,
        name: "driver",
      },
      value: 10,
    };

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockRideRepository.confirmRide(params)).never();
  });

  it("should return a Right(void) if the data is valid", async () => {
    // Arrange
    const params = {
      customer_id: "1",
      origin: "origin",
      destination: "destination",
      distance: 10,
      duration: "10min",
      driver: {
        id: 1,
        name: "driver",
      },
      value: 10,
    };

    when(mockRideRepository.confirmRide(params)).thenResolve(new Right(undefined));

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isRight()).toBeTruthy();
    verify(mockRideRepository.confirmRide(params)).once();
  });

  it("should return a Left(Failure) if the data is invalid", async () => {
    // Arrange
    const params = {
      customer_id: "1",
      origin: "origin",
      destination: "destination",
      distance: 10,
      duration: "10min",
      driver: {
        id: 1,
        name: "driver",
      },
      value: 10,
    };

    when(mockRideRepository.confirmRide(params)).thenResolve(
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
    verify(mockRideRepository.confirmRide(params)).once();
  });
});
