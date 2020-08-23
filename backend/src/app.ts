import express from "express";
import workOrderRoutes from "./routes/workorder_routes";
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :date")
);

app.use("/api", workOrderRoutes);

app.listen(4000);
