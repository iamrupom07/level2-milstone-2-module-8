import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const decodedToken = (await jwt.verify(
        token as string,
        config.secret,
      )) as JwtPayload;
      const userData = await pool.query("SELECT * FROM users WHERE id=$1", [
        decodedToken.email,
      ]);

      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        res.status(401).json({
          success: false,
          message: "User Not Found",
        });
      }
      if (!user?.is_active) {
        res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      req.user = decodedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
