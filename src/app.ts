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

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://maintenance-client-smoky.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      try {
        const cleanOrigin = new URL(origin).origin;

        if (allowedOrigins.includes(cleanOrigin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      } catch {
        callback(new Error("Invalid origin"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// middlewares configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
