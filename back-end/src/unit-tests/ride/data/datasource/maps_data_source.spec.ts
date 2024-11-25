import { Client, DirectionsRequest, Status } from "@googlemaps/google-maps-services-js";
import { MapsDataSourceImpl } from "../../../../ride/data/datasource/maps_data_source";
import { instance, mock, when, verify, _ } from "@johanblumenberg/ts-mockito";
import { AxiosRequestHeaders } from "axios";
import { ServerException } from "../../../../core/errors/exception";

describe("mapsDataSourceImpl", () => {
  let mapsDataSourceImpl: MapsDataSourceImpl;
  let googleClientMock: Client;

  beforeEach(() => {
    googleClientMock = mock(Client);
    mapsDataSourceImpl = new MapsDataSourceImpl({ routingClient: instance(googleClientMock) });
  });

  it("should return route info", async () => {
    //Arrange
    const params: DirectionsRequest = {
      params: {
        origin: "origin",
        destination: "destination",
        client_id: "your_client_id",
        client_secret: "your_client_secret",
      },
    };

    const directionsResponse = {
      data: {
        geocoded_waypoints: [],
        routes: [],
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

    when(googleClientMock.directions(params)).thenResolve(directionsResponse);

    //Act
    const result = await mapsDataSourceImpl.getRouteInfo(params);

    //Assert
    expect(result).toEqual(directionsResponse);
    verify(googleClientMock.directions(params)).once();
  });

  it("should throw an ServeException if an error occurs", async () => {
    //Arrange
    const params: DirectionsRequest = {
      params: {
        origin: "origin",
        destination: "destination",
        client_id: "your_client_id",
        client_secret: "your_client_secret",
      },
    };

    when(googleClientMock.directions(params)).thenThrow(new Error("Error"));

    //Act
    try {
      await mapsDataSourceImpl.getRouteInfo(params);
    } catch (error) {
      //Assert
      expect(error).toBeInstanceOf(ServerException);
    }

    //Assert
    verify(googleClientMock.directions(params)).once();
  });
});
