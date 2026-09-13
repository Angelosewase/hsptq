import { jwt } from "hono/jwt";
import { JWT_SECRET } from "../services/auth.service";

// Middleware to protect staff routes
export const staffAuth = jwt({
  secret: JWT_SECRET,
  alg: "HS256",
});

// For MVP, patient and staff might share some endpoints, so we just check valid token
export const authMiddleware = jwt({
  secret: JWT_SECRET,
  alg: "HS256",
});
