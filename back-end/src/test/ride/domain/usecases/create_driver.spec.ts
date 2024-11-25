import { instance, mock, when, verify, _ } from "@johanblumenberg/ts-mockito";
import { RideRepository } from "../../../../ride/domain/repo/ride_repository";
import { CreateDriver } from "../../../../ride/domain/usecases/create_driver";
import { Driver } from "../../../../ride/domain/entities/driver";
import { Left, Right } from "../../../../core/typedefs/result_future";
import { Failure } from "../../../../core/errors/failure";

describe("createDriverUseCase", () => {
  let mockDriverRepository: RideRepository;
  let usecase: CreateDriver;

  beforeAll(() => {
    mockDriverRepository = mock(RideRepository);
    usecase = new CreateDriver(instance(mockDriverRepository));
  });

  it("should return a Right(Driver) if the data is valid", async () => {
    // Arrange
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

    when(mockDriverRepository.createDriver(params)).thenResolve(new Right(params));

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(params);
    verify(mockDriverRepository.createDriver(params)).once();
  });

  it("should return a Left(Failure) if name is not provided", async () => {
    // Arrange
    const params: Driver = {
      name: "",
      id: 0,
      description: "",
      car: "",
      tax: 0,
      minKm: 0,
      review: undefined,
      rides: [],
    };

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockDriverRepository.createDriver(params)).never();
  });

  it("should return a Left(Failure) if the data is invalid", async () => {
    // Arrange
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

    when(mockDriverRepository.createDriver(params)).thenResolve(
      new Left(
        new Failure({
          error_code: "INVALID_DATA",
          error_description: "Name is required",
          status_code: 400,
        })
      )
    );

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockDriverRepository.createDriver(params)).once();
  });
});
