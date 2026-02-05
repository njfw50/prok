/**
 * Error Handler Module - Harvard Error Management
 * Centralized error handling with proper categorization and recovery
 * @module server/_core/error-handler
 */

/**
 * Custom application error class
 * @class AppError
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public message: string,
    public context?: Record<string, any>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Error categories
 */
export enum ErrorCategory {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  INTERNAL = 'INTERNAL_SERVER_ERROR',
  EXTERNAL = 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
}

/**
 * Centralized Error Handler
 * @class ErrorHandler
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorCallbacks: Array<(error: AppError) => void> = [];

  private constructor() {}

  /**
   * Get singleton instance
   * @returns {ErrorHandler}
   */
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Register error callback
   * @param {Function} callback
   */
  public onError(callback: (error: AppError) => void): void {
    this.errorCallbacks.push(callback);
  }

  /**
   * Handle error with proper categorization
   * @param {any} error
   * @returns {AppError}
   */
  public handle(error: any): AppError {
    const appError = this.categorizeError(error);
    this.executeCallbacks(appError);
    return appError;
  }

  /**
   * Categorize and normalize error
   * @private
   * @param {any} error
   * @returns {AppError}
   */
  private categorizeError(error: any): AppError {
    // Handle validation errors
    if (error.validationError || error.isJoi) {
      return new AppError(
        400,
        ErrorCategory.VALIDATION,
        'Validation failed',
        { details: error.details },
      );
    }

    // Handle authentication errors
    if (error.code === 'INVALID_TOKEN' || error.code === 'TOKEN_EXPIRED') {
      return new AppError(
        401,
        ErrorCategory.AUTHENTICATION,
        'Invalid or expired token',
        { originalCode: error.code },
      );
    }

    // Handle authorization errors
    if (error.code === 'FORBIDDEN' || error.statusCode === 403) {
      return new AppError(
        403,
        ErrorCategory.AUTHORIZATION,
        'Access denied',
      );
    }

    // Handle not found errors
    if (error.statusCode === 404 || error.code === 'NOT_FOUND') {
      return new AppError(
        404,
        ErrorCategory.NOT_FOUND,
        'Resource not found',
      );
    }

    // Handle conflict errors
    if (error.statusCode === 409 || error.code === 'CONFLICT') {
      return new AppError(
        409,
        ErrorCategory.CONFLICT,
        'Resource conflict',
      );
    }

    // Handle rate limit errors
    if (error.statusCode === 429) {
      return new AppError(
        429,
        ErrorCategory.RATE_LIMIT,
        'Too many requests',
      );
    }

    // Handle external service errors
    if (error.isExternalError) {
      return new AppError(
        502,
        ErrorCategory.EXTERNAL,
        'External service error',
        { originalError: error.message },
      );
    }

    // Default to internal error
    if (error instanceof AppError) {
      return error;
    }

    return new AppError(
      500,
      ErrorCategory.INTERNAL,
      error.message || 'Internal server error',
      { originalError: error.toString(), stack: error.stack },
    );
  }

  /**
   * Execute error callbacks
   * @private
   * @param {AppError} error
   */
  private executeCallbacks(error: AppError): void {
    for (const callback of this.errorCallbacks) {
      try {
        callback(error);
      } catch (err) {
        console.error('Error callback failed:', err);
      }
    }
  }

  /**
   * Format error for response
   * @param {AppError} error
   * @returns {Record<string, any>}
   */
  public formatForResponse(error: AppError): Record<string, any> {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        ...(process.env.NODE_ENV === 'development' && {
          context: error.context,
          stack: error.stack,
        }),
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create validation error
   * @static
   * @param {string} message
   * @param {any} details
   * @returns {AppError}
   */
  public static createValidationError(
    message: string,
    details?: any,
  ): AppError {
    return new AppError(
      400,
      ErrorCategory.VALIDATION,
      message,
      { details },
    );
  }

  /**
   * Create authentication error
   * @static
   * @param {string} message
   * @returns {AppError}
   */
  public static createAuthenticationError(message: string): AppError {
    return new AppError(
      401,
      ErrorCategory.AUTHENTICATION,
      message,
    );
  }

  /**
   * Create authorization error
   * @static
   * @param {string} message
   * @returns {AppError}
   */
  public static createAuthorizationError(message: string): AppError {
    return new AppError(
      403,
      ErrorCategory.AUTHORIZATION,
      message,
    );
  }

  /**
   * Create not found error
   * @static
   * @param {string} resource
   * @returns {AppError}
   */
  public static createNotFoundError(resource: string): AppError {
    return new AppError(
      404,
      ErrorCategory.NOT_FOUND,
      `${resource} not found`,
    );
  }
}
