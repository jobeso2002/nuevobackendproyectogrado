// src/custom.d.ts
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: any; // O usa un tipo más específico en lugar de 'any'
  }
}
