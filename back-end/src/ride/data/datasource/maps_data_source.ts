import {
  Client,
  DirectionsRequest,
  DirectionsResponse,
} from "@googlemaps/google-maps-services-js";
import { ServerException } from "../../../core/errors/exception";

export abstract class MapsDataSource {
  abstract getRouteInfo(params: DirectionsRequest): Promise<DirectionsResponse>;
}

export class MapsDataSourceImpl extends MapsDataSource {
  routingClient: Client;
  constructor({ routingClient }: { routingClient: Client }) {
    super();
    this.routingClient = routingClient;
  }

  async getRouteInfo(params: DirectionsRequest): Promise<DirectionsResponse> {
    try {
      return this.routingClient.directions(params);
    } catch (error) {
      throw new ServerException(
        "Erro ao buscar informações da rota",
        500,
        "ROUTE_INFO_ERROR"
      );
    }
  }
}
