export type ErrorEntity = {
  errorCode: number,
  message: string,
}

export class ApplicationError extends Error {
  readonly statusCode: number
  readonly entity: ErrorEntity

  constructor(entity: ErrorEntity, statusCode: number = 400) {
    super();

    // Extending a built-in class
    Object.setPrototypeOf(this, ApplicationError.prototype);

    this.statusCode = statusCode;
    this.entity = entity;
  }
}
