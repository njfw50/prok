/**
 * Validators Module - Harvard Validation Standards
 * Type-safe validation schemas and utilities
 * @module server/_core/validators
 */

/**
 * Validation result interface
 * @interface ValidationResult
 */
interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Base validator class
 * @abstract
 * @class Validator
 */
export abstract class Validator<T> {
  /**
   * Validate data
   * @abstract
   * @param {unknown} data
   * @returns {ValidationResult<T>}
   */
  abstract validate(data: unknown): ValidationResult<T>;
}

/**
 * User validation schema
 * @class UserValidator
 */
export class UserValidator extends Validator<{
  username: string;
  email: string;
  password: string;
}> {
  validate(data: unknown): ValidationResult<{
    username: string;
    email: string;
    password: string;
  }> {
    const errors: Record<string, string[]> = {};

    if (typeof data !== 'object' || data === null) {
      return { success: false, errors: { root: ['Data must be an object'] } };
    }

    const obj = data as any;

    // Username validation
    if (!obj.username || typeof obj.username !== 'string') {
      errors.username = ['Username is required and must be a string'];
    } else if (obj.username.length < 3) {
      errors.username = ['Username must be at least 3 characters'];
    } else if (!/^[a-zA-Z0-9_-]+$/.test(obj.username)) {
      errors.username = ['Username can only contain alphanumeric characters, - and _'];
    }

    // Email validation
    if (!obj.email || typeof obj.email !== 'string') {
      errors.email = ['Email is required and must be a string'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email)) {
      errors.email = ['Email format is invalid'];
    }

    // Password validation
    if (!obj.password || typeof obj.password !== 'string') {
      errors.password = ['Password is required and must be a string'];
    } else if (obj.password.length < 8) {
      errors.password = ['Password must be at least 8 characters'];
    } else if (!/[A-Z]/.test(obj.password)) {
      errors.password = ['Password must contain at least one uppercase letter'];
    } else if (!/[0-9]/.test(obj.password)) {
      errors.password = ['Password must contain at least one number'];
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      data: {
        username: obj.username,
        email: obj.email,
        password: obj.password,
      },
    };
  }
}

/**
 * Authentication validator
 * @class AuthValidator
 */
export class AuthValidator extends Validator<{
  token: string;
}> {
  validate(data: unknown): ValidationResult<{ token: string }> {
    const errors: Record<string, string[]> = {};

    if (typeof data !== 'object' || data === null) {
      return { success: false, errors: { root: ['Data must be an object'] } };
    }

    const obj = data as any;

    if (!obj.token || typeof obj.token !== 'string') {
      errors.token = ['Token is required and must be a string'];
    } else if (obj.token.split('.').length !== 3) {
      errors.token = ['Token format is invalid'];
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      data: {
        token: obj.token,
      },
    };
  }
}

/**
 * Room creation validator
 * @class RoomValidator
 */
export class RoomValidator extends Validator<{
  name: string;
  maxParticipants?: number;
}> {
  validate(data: unknown): ValidationResult<{
    name: string;
    maxParticipants?: number;
  }> {
    const errors: Record<string, string[]> = {};

    if (typeof data !== 'object' || data === null) {
      return { success: false, errors: { root: ['Data must be an object'] } };
    }

    const obj = data as any;

    if (!obj.name || typeof obj.name !== 'string') {
      errors.name = ['Room name is required and must be a string'];
    } else if (obj.name.length < 3 || obj.name.length > 100) {
      errors.name = ['Room name must be between 3 and 100 characters'];
    }

    if (obj.maxParticipants !== undefined) {
      if (typeof obj.maxParticipants !== 'number') {
        errors.maxParticipants = ['Max participants must be a number'];
      } else if (obj.maxParticipants < 2 || obj.maxParticipants > 1000) {
        errors.maxParticipants = ['Max participants must be between 2 and 1000'];
      }
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      data: {
        name: obj.name,
        maxParticipants: obj.maxParticipants || 10,
      },
    };
  }
}

/**
 * Song selection validator
 * @class SongValidator
 */
export class SongValidator extends Validator<{
  songId: string;
}> {
  validate(data: unknown): ValidationResult<{ songId: string }> {
    const errors: Record<string, string[]> = {};

    if (typeof data !== 'object' || data === null) {
      return { success: false, errors: { root: ['Data must be an object'] } };
    }

    const obj = data as any;

    if (!obj.songId || typeof obj.songId !== 'string') {
      errors.songId = ['Song ID is required and must be a string'];
    } else if (!/^[a-zA-Z0-9-]+$/.test(obj.songId)) {
      errors.songId = ['Song ID format is invalid'];
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      data: {
        songId: obj.songId,
      },
    };
  }
}

export type { ValidationResult };
