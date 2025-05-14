import express, { Application } from "express";
import cors from "cors";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import router from "./app/routes";
import SwaggerRoutes from "./app/routes/swagger.routes";
import config from "./app/config";
import cookieParser from "cookie-parser";

const app: Application = express();

// middlewares configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:8083",
      "https://ac-maintenance-client.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// test server
app.get("/", (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: `${config.app_name} server is working fine`,
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
