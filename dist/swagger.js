"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const config_1 = __importDefault(require("./app/config"));
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Dreamestate API",
        version: "1.0.0",
        description: "Documentation for Dreamestate API",
    },
    servers: [
        {
            url: `http://localhost:${config_1.default.port}/api/v1`,
            description: "Local server",
        },
    ],
    components: {
        securitySchemes: {
            AdminAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
            },
            UserAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
            },
        },
    },
};
const options = {
    swaggerDefinition,
    apis: ["./src/app/**/*.swagger.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
