declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_BASE_URL_DEV?: string;
      NEXT_MONGO_DB_URI?: string;
      NEXT_PUBLIC_AWS_ACCESS_KEY_ID?: string;
      NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY?: string;
      NEXT_PUBLIC_AWS_REGION?: string;
      NEXT_PUBLIC_AWS_BUCKET_NAME?: string;
      NEXT_JWT_SECRET: string;
      NEXT_PUBLIC_SUPPORT_EMAIL: string;
    }
  }
}

export {};
