export const config = {
  port: Number(process.env.PORT ?? 3002),
  nodeEnv: process.env.NODE_ENV ?? "development",
} as const;
