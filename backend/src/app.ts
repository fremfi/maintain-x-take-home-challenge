import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";
import { ValidateError } from "tsoa";
const cors = require("cors");
const morgan = require("morgan");
import bodyParser from "body-parser";
import { RegisterRoutes } from "../build/routes";
import { ResourceNotFoundError, DatabaseError } from "./error";

const app = express();

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :date")
);

RegisterRoutes(app);

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      status: 422,
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof ResourceNotFoundError) {
    return res.status(404).json({
      status: 404,
      message: "Resource not found",
      details: err.message,
    });
  }
  if (err instanceof DatabaseError) {
    return res.status(422).json({
      status: 422,
      message: "Validation Failed",
      details: err.message,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }

  next();
});

app.listen(4000);
