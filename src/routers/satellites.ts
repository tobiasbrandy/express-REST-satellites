import express from 'express';
import z from 'zod';

import { AppCtx } from '../config/context';
import { SatelliteServiceCtx } from '../services/satellite';
import { SatelliteSchema } from '../validation/satellite';
import { defaultRequestHandler as reqHandler, DefaultRequestHandler as ReqHandler } from './utils';

export type SatellitesRouterCtx = Pick<AppCtx, 'satelliteService'> & SatelliteServiceCtx;

const handler = <T1,T2,T3,T4,T5 extends Record<string, any>>(fn: ReqHandler<SatellitesRouterCtx, T1,T2,T3,T4,T5>) => reqHandler(fn);

const router = express.Router();

router.route('/')
  .get(handler(async (ctx, req, res) => {
    const satellites = await ctx.satelliteService.findAll(ctx);
    
    res.json(satellites);
  }))
  .delete(handler(async (ctx, req, res) => {
    const count = await ctx.satelliteService.deleteAll(ctx);

    res.json(count);
  }))
  ;

router.route('/:name')
  .all((req, res, next) => {
    req.params = z.object({
      name: SatelliteSchema.shape.name,
    }).parse(req.params);
    next();
  })
  .get(handler(async (ctx, req, res) => {
    const satellite = await ctx.satelliteService.findByName(req.params.name, ctx);

    res.json(satellite);
  }))
  .post(handler(async (ctx, req, res) => {
    const satellitePos = SatelliteSchema.pick({
      posX: true,
      posY: true,
    }).parse(req.body);

    const satellite = await ctx.satelliteService.create({
      name: req.params.name,
      posX: satellitePos.posX,
      posY: satellitePos.posY,
    }, ctx);

    res.json(satellite);
  }))
  .put(handler(async (ctx, req, res) => {
    const satellitePos = SatelliteSchema.pick({
      posX: true,
      posY: true,
    }).parse(req.body);

    const satellite = await ctx.satelliteService.updateByName(req.params.name, satellitePos, ctx);

    res.json(satellite);
  }))
  .delete(handler(async (ctx, req, res) => {
      ctx.satelliteService.deleteByName(req.params.name, ctx);
  }))
  ;

export default router;
