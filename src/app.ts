import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import router from "./app/routes";
import SwaggerRoutes from "./app/routes/swagger.routes";
import config from "./app/config";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";

const app: Application = express();

/**
 * =========================
 * CORS CONFIGURATION
 * =========================
 */

const allowedOrigins = [
  "http://localhost:3000",
  "https://maintenanceqt.vercel.app",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") // allow all vercel preview deployments
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Important for preflight requests
app.options("*", cors(corsOptions));

/**
 * =========================
 * MIDDLEWARES
 * =========================
 */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * =========================
 * TEST ROUTE
 * =========================
 */

app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: `${config.app_name} server is working fine`,
  });
});

/**
 * =========================
 * API ROUTES
 * =========================
 */

app.use("/api/v1", router);

/**
 * =========================
 * SWAGGER
 * =========================
 */

app.use("/api-docs", SwaggerRoutes);

/**
 * =========================
 * ERROR HANDLING
 * =========================
 */

app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;

// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://maintenanceqt.vercel.app",
//   );

//   // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE, OPTIONS",
//   );

//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   next();
// });
