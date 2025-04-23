import express, { Application } from "express";
import cors from "cors";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import router from "./app/routes";
import SwaggerRoutes from "./app/routes/swagger.routes";
import configureCors from "./app/utils/configureCors";

const app: Application = express();

// middlewares configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(configureCors));

// test server
app.get("/", (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Dreamestate` server is working fine",
  });
});

// api routes
app.use("/api/v1", router);

//api documentation
app.use("/api-docs", SwaggerRoutes);

// handle error
app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
