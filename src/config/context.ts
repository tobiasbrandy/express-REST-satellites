import { Request } from 'express';
import { RequestHandler, ParamsDictionary, Query } from 'express-serve-static-core';

import { PrismaClient } from '@prisma/client';
import { SatelliteService } from '../services/satellite';
import { SatelliteComService } from '../services/satelliteCom';

export type AppCtx = {
  prisma: PrismaClient,
  satelliteService: SatelliteService
  satelliteComService: SatelliteComService
};

export function setCtx<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
>(req: Request<P, ResBody, ReqBody, ReqQuery, Locals>, ctx: AppCtx) {
  (req as any).ctx = ctx;
}

export function getCtx<
  T = AppCtx,
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
>(req: Request<P, ResBody, ReqBody, ReqQuery, Locals>) {
  return (req as any).ctx as T;
}

export function appCtx(ctx: AppCtx): RequestHandler {
  return (req, _res, next) => {
    setCtx(req, ctx);
    next();
  };
}
