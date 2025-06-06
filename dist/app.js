"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFoundHandler_1 = __importDefault(require("./app/middlewares/notFoundHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const swagger_routes_1 = __importDefault(require("./app/routes/swagger.routes"));
const config_1 = __importDefault(require("./app/config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:8089",
        "https://ac-maintenance-client.vercel.app",
    ],
    credentials: true,
}));
// middlewares configuration
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// test server
app.get("/", (req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: `${config_1.default.app_name} server is working fine`,
    });
});
// api routes
app.use("/api/v1", routes_1.default);
//api documentation
app.use("/api-docs", swagger_routes_1.default);
// handle error
app.use(globalErrorHandler_1.default);
app.use(notFoundHandler_1.default);
exports.default = app;
