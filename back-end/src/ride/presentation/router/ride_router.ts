import express from "express";
import { CreateDriver } from "../../domain/usecases/create_driver";
import { Failure } from "../../../core/errors/failure";

export default function RideRouter(createDriverUseCase: CreateDriver) {
  const router = express.Router();

  router.post("/create-driver", async (req, res) => {
    const result = await createDriverUseCase.call(req.body);
    if (result.isRight()) {
      res.status(201).json(result.value);
    }
    if (result.isLeft()) {
      const error = result.value as Failure;
      res.status(error.status_code).json(result.value);
    }
  });

  return router;
}
