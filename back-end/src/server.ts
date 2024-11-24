import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { rideMiddleware } from "./ride/presentation/middleware/ride_middleware";

var cors = require("cors");

const app = express();
const port = 8080;

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(bodyParser.json());
app.use((err: Error, _req: Request, res: any, next: any) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description:
        "Os dados fornecidos no corpo da requisição são inválidos.",
    });
  }
  next(err);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/ride", rideMiddleware);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
