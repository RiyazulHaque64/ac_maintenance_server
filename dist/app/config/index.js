"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    salt_rounds: process.env.PASSWORD_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    email: process.env.EMAIL,
    super_admin_name: process.env.SUPER_ADMIN_NAME,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
    email_app_pass: process.env.EMAIL_APP_PASS,
    supabase_bucket_url: process.env.SUPABASE_BUCKET_URL,
    supabase_bucket_key: process.env.SUPABASE_BUCKET_KEY,
    supabase_bucket_name: process.env.SUPABASE_BUCKET_NAME,
    app_name: process.env.APP_NAME,
};
