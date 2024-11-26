import express from "express";
import { CreateDriver } from "../../domain/usecases/create_driver";
import { Failure } from "../../../core/errors/failure";
import { EstimateRide } from "../../domain/usecases/estimate_ride";
import { ConfirmRide } from "../../domain/usecases/confirm_ride";
import { GetRides, GetRidesParams } from "../../domain/usecases/get_rides";

class RideRouter {
  private router = express.Router();

  constructor(
    private createDriverUseCase: CreateDriver,
    private estimateRideUseCase: EstimateRide,
    private confirmRideUseCase: ConfirmRide,
    private getRidesUseCase: GetRides
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/create-driver", this.createDriverHandler.bind(this));
    this.router.post("/estimate", this.estimateRideHandler.bind(this));
    this.router.patch("/confirm", this.confirmRideHandler.bind(this));
    this.router.get("/:customer_id", this.getRidesHandler.bind(this));
  }

  private async createDriverHandler(req: express.Request, res: express.Response) {
    const result = await this.createDriverUseCase.call(req.body);

    if (result.isRight()) {
      res.status(200).json(result.value);
    }

    if (result.isLeft()) {
      const error = result.value as Failure;
      res.status(error.status_code).json(error.toJsonRes());
    }
  }

  private async estimateRideHandler(req: express.Request, res: express.Response) {
    const result = await this.estimateRideUseCase.call(req.body);

    if (result.isRight()) {
      res.status(200).json(result.value);
    }

    if (result.isLeft()) {
      const error = result.value as Failure;
      res.status(error.status_code).json(error.toJsonRes());
    }
  }

  private async confirmRideHandler(req: express.Request, res: express.Response) {
    const result = await this.confirmRideUseCase.call(req.body);

    if (result.isRight()) {
      res.status(200).json({ success: true });
    }

    if (result.isLeft()) {
      const error = result.value as Failure;
      res.status(error.status_code).json(error.toJsonRes());
    }
  }

  private async getRidesHandler(req: express.Request, res: express.Response) {
    const { driver_id } = req.query;

    const params: GetRidesParams = {
      customer_id: req.params.customer_id,
      driver_id: parseInt(driver_id as string),
    };

    const result = await this.getRidesUseCase.call(params);

    if (result.isRight()) {
      res.status(200).json(result.value);
    }

    if (result.isLeft()) {
      const error = result.value as Failure;
      res.status(error.status_code).json(error.toJsonRes());
    }
  }

  public getRouter() {
    return this.router;
  }
}

export default RideRouter;
