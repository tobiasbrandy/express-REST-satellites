import { NextFunction, RequestHandler } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { getCtx } from '../config/context';

export type DefaultRequestHandler<
  Ctx,
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
> = (ctx: Ctx, ...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>>) => void | Promise<void>;

export function defaultRequestHandler<
  Ctx,
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
>(fn: DefaultRequestHandler<Ctx, P, ResBody, ReqBody, ReqQuery, Locals>) {
  return asyncRequestHandler(withCtx(fn))
}

export function asyncRequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
>(fn: (...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>>) => void | Promise<void>) {
  return (...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>>) => {
    const fnReturn = fn(...args)
    const next = args[args.length - 1] as NextFunction;
    return Promise.resolve(fnReturn).catch(
      e => next(e)
    )
  }
}

export function withCtx<
  Ctx,
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
>(fn: (ctx: Ctx, ...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>>) => void | Promise<void>) {
  return (...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>>) => {
    const req = args[0];
    const ctx = getCtx<Ctx, P, ResBody, ReqBody, ReqQuery, Locals>(req);
    return fn(ctx, ...args)
  }
}
