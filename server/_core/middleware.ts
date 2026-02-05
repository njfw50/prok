/**
 * Middleware Module - Harvard Request/Response Handling
 * Middleware for error handling, logging, and request validation
 * @module server/_core/middleware
 */

import type { Request, Response, NextFunction } from 'express';
import { Logger } from './logger';
import { ErrorHandler, AppError } from './error-handler';

const logger = Logger.getInstance();
const errorHandler = ErrorHandler.getInstance();

/**
 * Request ID middleware - adds unique ID to each request
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}

/**
 * Logging middleware - logs all requests and responses
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();

  logger.info(`${req.method} ${req.path}`, {
    requestId: req.id,
    query: req.query,
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path} - ${res.statusCode}`, {
      requestId: req.id,
      duration: `${duration}ms`,
      statusCode: res.statusCode,
    });
  });

  next();
}

/**
 * Error handling middleware - catches and formats errors
 * @param {any} error
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function errorHandlingMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const appError = errorHandler.handle(error);

  logger.error(`Error in ${req.method} ${req.path}`, {
    error: appError.message,
    code: appError.code,
    statusCode: appError.statusCode,
    requestId: req.id,
  });

  res.status(appError.statusCode).json(
    errorHandler.formatForResponse(appError),
  );
}

/**
 * Request validation middleware factory
 * @template T
 * @param {Validator<T>} validator
 * @returns {Function}
 */
export function validationMiddleware<T>(validator: any) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = validator.validate(req.body);

    if (!result.success) {
      const error = ErrorHandler.createValidationError(
        'Validation failed',
        result.errors,
      );
      return errorHandlingMiddleware(error, req, res, next);
    }

    req.validatedData = result.data;
    next();
  };
}

/**
 * Rate limiting middleware
 * @param {number} requestsPerMinute
 * @returns {Function}
 */
export function rateLimitMiddleware(requestsPerMinute: number) {
  const requests: Map<string, number[]> = new Map();

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    if (!requests.has(clientId)) {
      requests.set(clientId, []);
    }

    const clientRequests = requests.get(clientId)!;
    const recentRequests = clientRequests.filter((t) => t > oneMinuteAgo);

    if (recentRequests.length >= requestsPerMinute) {
      const error = new AppError(
        429,
        'RATE_LIMIT_ERROR',
        'Too many requests, please try again later',
      );
      return errorHandlingMiddleware(error, req, res, next);
    }

    recentRequests.push(now);
    requests.set(clientId, recentRequests);

    next();
  };
}

/**
 * CORS middleware configuration
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Request-ID',
  );

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
}

/**
 * Security headers middleware
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function securityHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next();
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      id?: string;
      validatedData?: any;
    }
  }
}
