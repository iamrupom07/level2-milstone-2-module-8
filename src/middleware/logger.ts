import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log("METHOD - URL - Time:", req.method, req.url, Date.now());
  const log = `METHOD -  ${req.method} URL - ${req.url} Time - ${Date.now()}`;
  fs.appendFile("logger.txt", log, (err) => {
    console.log(err);
  });
  next();
};

export default logger;
