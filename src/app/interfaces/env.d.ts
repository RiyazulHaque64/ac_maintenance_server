declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    DATABASE_URL: string;
    NODE_ENV: "development" | "production";
    APP_NAME: string;
    DREAMESTATE_EMAIL: string;
    SUPER_ADMIN_F_NAME: string;
    SUPER_ADMIN_L_NAME: string;
    SUPER_ADMIN_PASSWORD: string;
    PASSWORD_SALT_ROUNDS: number;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    EMAIL_APP_PASS: string;
    SUPABASE_BUCKET_URL: string;
    SUPABASE_BUCKET_KEY: string;
    SUPABASE_BUCKET_NAME: string;
  }
}
