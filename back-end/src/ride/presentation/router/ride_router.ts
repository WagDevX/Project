import express from "express";
import { CreateDriver } from "../../domain/usecases/create_driver";
import { Failure } from "../../../core/errors/failure";
import { EstimateRide } from "../../domain/usecases/estimate_ride";
import { ConfirmRide } from "../../domain/usecases/confirm_ride";

export default function RideRouter(
  createDriverUseCase: CreateDriver,
  estimateRideUseCase: EstimateRide,
  confirmRideUseCase: ConfirmRide
) {
  const router = express.Router();

  router.post("/create-driver", async (req, res) => {
    const result = await createDriverUseCase.call(req.body);

    if (result.isRight()) {
      res.status(200).json(result.value);
    }

    if (result.isLeft()) {
      const error = result.value as Failure;
      res.status(error.status_code).json(error.toJsonRes());
    }
  });

  router.post("/estimate", async (req, res) => {
    const result = await estimateRideUseCase.call(req.body);

    if (result.isRight()) {
      res.status(200).json(result.value);
    }

    if (result.isLeft()) {
      const error = result.value as Failure;
      res.status(error.status_code).json(error.toJsonRes());
    }
  });

  router.patch("/confirm", async (req, res) => {
    const result = await confirmRideUseCase.call(req.body);

    if (result.isRight()) {
      res.status(200).json({ success: true });
    }

    if (result.isLeft()) {
      const error = result.value as Failure;
      res.status(error.status_code).json(error.toJsonRes());
    }
  });

  return router;
}
