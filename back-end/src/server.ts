import express, { Request, Response } from "express";
import RideRouter from "./ride/presentation/router/ride_router";
import { CreateDriver } from "./ride/domain/usecases/create_driver";
import { RideRepositoryImpl } from "./ride/data/repo/ride_repo_impl";
import { RideDataSourceImpl } from "./ride/data/datasource/ride_data_source";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

var cors = require("cors");

const app = express();
const port = 8080;

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

const rideMiddleware = RideRouter(new CreateDriver(new RideRepositoryImpl(new RideDataSourceImpl({ prismaClient }))));

app.use("/ride", rideMiddleware);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
