import express from "express";
import { CreateDriver } from "../../domain/usecases/create_driver";
import { Failure } from "../../../core/errors/failure";
import { EstimateRide } from "../../domain/usecases/estimate_ride";

export default function RideRouter(
  createDriverUseCase: CreateDriver,
  estimateRideUseCase: EstimateRide
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

  router.post("/estimate-ride", async (req, res) => {
    try {
      const result = await estimateRideUseCase.call(req.body);
      if (result.isRight()) {
        res.status(200).json(result.value);
      }
      if (result.isLeft()) {
        const error = result.value as Failure;
        res.status(error.status_code).json(error.toJsonRes());
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
}
