import swaggerJsdoc from "swagger-jsdoc";
import config from "./app/config";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Dreamestate API",
    version: "1.0.0",
    description: "Documentation for Dreamestate API",
  },
  servers: [
    {
      url:  `http://localhost:${config.port}/api/v1`,
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

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
