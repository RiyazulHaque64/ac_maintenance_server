"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const node_cron_1 = __importDefault(require("node-cron"));
const clearOldOtps_1 = __importDefault(require("./app/utils/clearOldOtps"));
const db_1 = require("./app/db");
const port = config_1.default.port || 9000;
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            server = app_1.default.listen(port, () => {
                console.log(`${config_1.default.app_name} server is running on port ${port}`);
            });
            yield (0, db_1.seedSuperAdmin)();
            // cron schedule to clear OTP
            node_cron_1.default.schedule("0 12 * * *", () => {
                (0, clearOldOtps_1.default)();
            });
        }
        catch (error) {
            console.error(error);
        }
    });
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
