import { Express } from 'express';

export type Options = {
  method: string,
  query?: any,
  body?: any,
  cookies?: any,
  connection?: any,
};

export type Result = {
  code: number,
  data: any,
  headers: any,
}

export default function runMiddleware(app: Express, path: string, options: Options): Promise<Result>;

