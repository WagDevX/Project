import { instance, mock, when, verify, _ } from "@johanblumenberg/ts-mockito";
import { RideRepository } from "../../../../ride/domain/repo/ride_repository";
import { GetRides, GetRidesParams } from "../../../../ride/domain/usecases/get_rides";
import { Left, Right } from "../../../../core/typedefs/result_future";
import { RidesResponse } from "../../../../ride/domain/entities/ride";
import { Failure } from "../../../../core/errors/failure";

describe("getRidesUseCase", () => {
  let mockRideRepository: RideRepository;
  let usecase: GetRides;

  beforeAll(() => {
    mockRideRepository = mock(RideRepository);
    usecase = new GetRides(instance(mockRideRepository));
  });

  it("should return a Right(RidesResponse) if the data is valid", async () => {
    // Arrange
    const params: GetRidesParams = {
      customer_id: "1",
      driver_id: undefined,
    };

    const ridesResponse: RidesResponse = {
      customer_id: "",
      rides: [],
    };

    when(mockRideRepository.getRides(params)).thenResolve(new Right(ridesResponse));

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isRight()).toBeTruthy();
  });

  it("should return a Left(Failure) if customer_id is not provided", async () => {
    // Arrange
    const params: GetRidesParams = {
      customer_id: "",
      driver_id: undefined,
    };

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockRideRepository.getRides(params)).never();
  });

  it("should return a Left(Failure) if repository returns a left", async () => {
    // Arrange
    const params: GetRidesParams = {
      customer_id: "1",
      driver_id: undefined,
    };

    when(mockRideRepository.getRides(params)).thenResolve(
      new Left(
        new Failure({
          error_code: "INVALID_DATA",
          error_description: "O id do cliente é obrigatório para buscar as corridas",
          status_code: 400,
        })
      )
    );

    // Act
    const result = await usecase.call(params);

    // Assert
    expect(result.isLeft()).toBeTruthy();
    verify(mockRideRepository.getRides(params)).once();
  });
});
