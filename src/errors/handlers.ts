import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { ApplicationError } from "./models";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if(res.headersSent) {
    return next(err)
  }

  if(err instanceof ApplicationError) {
    res.status(err.statusCode).json(err.entity);
  } else if(err instanceof ZodError) {
    res.status(400).json({ errorCode: 2, issues: err.issues });
  } else if(err instanceof Error) {
    res.status(500).json({ errorCode: 0, message: err.message });
  } else {
    res.status(500).json({ errorCode: 0, message: String(err) });
  }
};