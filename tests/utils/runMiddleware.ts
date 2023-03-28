import { Express, Request, Response } from 'express';
import { Query } from 'express-serve-static-core';
import { IncomingHttpHeaders, OutgoingHttpHeader, OutgoingHttpHeaders } from 'http';

export type Options = {
  method: string,
  query?: Query,
  body?: any,
  headers?: IncomingHttpHeaders,
  cookies?: any,
  hostname?: string, 
};

export type Result = {
  code: number,
  data: any,
  headers: OutgoingHttpHeaders,
}

export default async function runMiddleware(app: Express, path: string, options: Options): Promise<Result> {
  const req = createMockReq(path, options);
  const res = new MockResponse();

  await app(req as unknown as Request, res as unknown as Response);

  return MockResponse.buildResult(res);
};

function createMockReq(path: string, options: Options) {
  return {
    url: path,
    method: options.method.toUpperCase(),
    hostname: options.hostname  || '',
    cookies: options.cookies    || {},
    query: options.query        || {},
    headers: options.headers    || {},
    body: options.body,
  };
}

class MockResponse {
  private code: number;
  private data: any
  private headers: Map<string, OutgoingHttpHeader>;

  statusMessage: string;

  static buildResult(mockRes: MockResponse) {
    return {
      code: mockRes.code,
      data: mockRes.data,
      headers: Object.fromEntries(mockRes.headers),
    }
  }
  
  constructor() {
    this.code = 200;
    this.statusMessage = 'OK';
    this.headers = new Map<string, OutgoingHttpHeader>();
  }

  get statusCode() {
    return this.code;
  }

  set statusCode(code) {
    this.code = code;
  }

  set(field: any): this;
  set(field: string, value?: string | string[]): this;
  set(field: any, value?: any) {
    if(arguments.length === 2) {
      this.setHeader(field, value);
    } else {
      for (var key in field) {
        this.setHeader(key, field[key]);
      }
    }
    return this;
  }
  header = this.set;

  setHeader(name: string, value: OutgoingHttpHeader) {
    this.headers.set(name, value);
    this.headers.set(name.toLowerCase(), value);
    return this;
  }

  getHeader(name: string) {
    return this.headers.get(name);
  }

  redirect(url: string): void;
  redirect(status: number, url: string): void;
  redirect(url: string, status: number): void;
  redirect(code: any, url?: any) {
    if(!isNumber(code)) {
      this.code = 301;
      url = code;
    } else {
      this.code = code;
    }

    this.setHeader("Location", url);

    this.end();
  };

  status(code: number) {
    this.code = code;
  }
  sendStatus = this.status;

  send(data?: any) {
    if(data !== undefined) {
      this.data = data;
    }
  }
  end = this.send;
  write = this.send;
  json = this.send;
}

function isNumber(value: any) {
  return typeof value == 'number'
  || (value != null && typeof value == 'object' && Object.prototype.toString.call(value) == '[object Number]')
}
