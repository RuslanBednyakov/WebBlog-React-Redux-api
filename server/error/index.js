import path from 'path';
import util from 'util';
import http from 'http';

// Errors for Users
export function HttpError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, HttpError);

  this.status = status;
  this.message = message || http.STATUS_CODES[status] || 'Error';
}

util.inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';