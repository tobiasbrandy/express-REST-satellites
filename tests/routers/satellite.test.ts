import express, { Express, ErrorRequestHandler } from 'express';
import runMiddleware from '../utils/runMiddleware';
import { createMockCtx, MockCtx } from '../utils/mockContext'
import { appCtx, AppCtx } from '../../src/config/context';

import satellitesRouter from '../../src/routers/satellites';
import { Prisma, Satellite } from '@prisma/client';
import { globalErrorHandler } from '../../src/errors/handlers';

let app: Express;
let mockCtx: MockCtx, ctx: AppCtx;

beforeEach(() => {
  [mockCtx, ctx] = createMockCtx();
  app = express()
  .use(appCtx(ctx))
  .use(satellitesRouter.use(globalErrorHandler))
  ;
});

test('GET / ', async () => {
  const sats: Satellite[] = [{
    name: 'name',
    posX: new Prisma.Decimal(1.0),
    posY: new Prisma.Decimal(2.0),
  }];
  mockCtx.satelliteService.findAll.mockResolvedValue(sats);

  const { code, data } = await runMiddleware(app, '/', { method: 'get' });

  expect(code).toBe(200);
  expect(data).toBe(sats);
});

test('POST /:name ', async () => {
  const name = 'name';

  const body = {
    name,
    posX: 1.0,
    posY: 2.0,
  };

  const sat: Satellite = {
    name,
    posX: new Prisma.Decimal(1.0),
    posY: new Prisma.Decimal(2.0),
  }
  mockCtx.satelliteService.create.mockResolvedValue(sat);

  const { code, data } = await runMiddleware(app, `/${name}`, { method: 'post', body });

  expect(code).toBe(200);
  expect(data).toEqual(sat);
});
