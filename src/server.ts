import { Server } from "http";
import app from "./app";
import config from "./app/config";
import cron from "node-cron";
import clearOldOtps from "./app/utils/clearOldOtps";
import { seedSuperAdmin } from "./app/db";

const port = config.port || 9000;

let server: Server;

async function main() {
  try {
    server = app.listen(port, () => {
      console.log(`${config.app_name} server is running on port ${port}`);
    });

    await seedSuperAdmin();

    // cron schedule to clear OTP
    cron.schedule("0 12 * * *", () => {
      clearOldOtps();
    });
  } catch (error) {
    console.error(error);
  }
}

// handle unhandled rejection
process.on("unhandledRejection", () => {
  console.log(`Unhandled rejection detected. shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// handle uncaught exception
process.on("uncaughtException", () => {
  console.log(`Uncaught exception detected. shutting down...`);
  process.exit(1);
});

main();
