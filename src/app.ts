import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express from 'express';
import { createHttpTerminator } from 'http-terminator';

import { PrismaClient } from '@prisma/client';
import { appCtx } from './config/context';

import * as satelliteService from './services/satellite';
import * as satelliteComService from './services/satelliteCom';

import { globalErrorHandler } from './errors/handlers';

import satelliteComsRouter from './routers/satelliteComs';
import satellitesRouter from './routers/satellites';

dotenvExpand.expand(dotenv.config());
const port = process.env.PORT || "8080";

const server = express()
  // Config
  .use(express.json())
  .use(appCtx({
    prisma: new PrismaClient(),
    satelliteService,
    satelliteComService,
  }))

  // Health Check
  .get('/', (_req, res) => res.send('Hello World from Satellites!'))

  // Routers
  .use('/satellites', satellitesRouter)
  .use('/satelliteComs', satelliteComsRouter)

  // Error Handler
  .use(globalErrorHandler)

  // 404 Handler
  .use((req, res) => res.status(404).json({ errorCode: 1, message: `${req.method} ${req.url} not found` }))

  .listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })
  ;

const terminator = createHttpTerminator({
  server,
  gracefulTerminationTimeout: 5000,
});

async function terminateServer() {
  console.log('Closing Server');
  await terminator.terminate();
  console.log('Server closed');
}

process.on('SIGINT', terminateServer);
process.on('SIGTERM', terminateServer);
