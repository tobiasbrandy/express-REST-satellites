import express from 'express';
import { z } from 'zod';

import { AppCtx } from '../config/context';
import { SatelliteComServiceCtx } from '../services/satelliteCom';
import { SatelliteComSchema, SatelliteSchema } from '../validation/satellite';
import { defaultRequestHandler as reqHandler, DefaultRequestHandler as ReqHandler } from './utils';

export type SatelliteComsRouterCtx = Pick<AppCtx, 'satelliteComService'> & SatelliteComServiceCtx;

const handler = <T1,T2,T3,T4,T5 extends Record<string, any>>(fn: ReqHandler<SatelliteComsRouterCtx, T1,T2,T3,T4,T5>) => reqHandler(fn);

const router = express.Router();

router.route('/')
  .get(handler(async (ctx, req, res) => {
    const coms = await ctx.satelliteComService.findAll(ctx);

    res.json(coms);
  }))
  .delete(handler(async (ctx, req, res) => {
    const count = await ctx.satelliteComService.deleteAll(ctx);

    res.json(count);
  }))
  ;

router.route('/:satellite')
  .all((req, _res, next) => {
    req.params = z.object({
      satellite: SatelliteSchema.shape.name,
    }).parse(req.params);
    next();
  })
  .get(handler(async (ctx, req, res) => {
    const com = await ctx.satelliteComService.findBySatellite(req.params.satellite, ctx);

    res.json(com);
  }))
  .put(handler(async (ctx, req, res) => {
    const comMessage = SatelliteComSchema.pick({
      distance: true,
      message: true,
    }).parse(req.body);

    const satellite = await ctx.satelliteComService.upsertBySatellite(req.params.satellite, comMessage, ctx);

    res.json(satellite);
  }))
  .delete(handler(async (ctx, req, res) => {
    ctx.satelliteComService.deleteBySatellite(req.params.satellite, ctx);
  }))
  ;

export default router
