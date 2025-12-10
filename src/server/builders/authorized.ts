import { base } from "./base";
import { authMiddleware } from "../middlewares/auth";

export const authorized = base.use(authMiddleware)