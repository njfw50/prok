/**
 * Logger Module - Harvard Structured Logging
 * Provides structured logging with multiple levels and formatters
 * @module server/_core/logger
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: string;
  stack?: string;
}

/**
 * Structured Logger following Harvard logging standards
 * @class Logger
 */
export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = 'info';
  private logs: LogEntry[] = [];
  private maxLogs = 10000;

  private constructor() {}

  /**
   * Get singleton instance
   * @returns {Logger}
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Set log level threshold
   * @param {LogLevel} level
   */
  public setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Log debug message
   * @param {string} message
   * @param {any} context
   */
  public debug(message: string, context?: any): void {
    this.log('debug', message, context);
  }

  /**
   * Log info message
   * @param {string} message
   * @param {any} context
   */
  public info(message: string, context?: any): void {
    this.log('info', message, context);
  }

  /**
   * Log warning message
   * @param {string} message
   * @param {any} context
   */
  public warn(message: string, context?: any): void {
    this.log('warn', message, context);
  }

  /**
   * Log error message
   * @param {string} message
   * @param {any} error
   */
  public error(message: string, error?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error: error?.message || String(error),
      stack: error?.stack,
    };

    this.logEntry(entry);
  }

  /**
   * Internal log method
   * @private
   */
  private log(level: LogLevel, message: string, context?: any): void {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };

    if (levels[level] >= levels[this.logLevel]) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        context,
      };

      this.logEntry(entry);
    }
  }

  /**
   * Process and store log entry
   * @private
   */
  private logEntry(entry: LogEntry): void {
    // Console output with colors
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m', // Green
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      reset: '\x1b[0m',
    };

    const color = colors[entry.level];
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const levelStr = entry.level.toUpperCase().padEnd(5);

    console.log(`${color}[${timestamp}] ${levelStr}${colors.reset} ${entry.message}`);

    if (entry.context) {
      console.log('  Context:', entry.context);
    }

    if (entry.error) {
      console.log(`  ${color}Error: ${entry.error}${colors.reset}`);
      if (entry.stack) {
        console.log('  Stack:', entry.stack);
      }
    }

    // Store in memory
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Get recent logs
   * @param {number} limit
   * @returns {LogEntry[]}
   */
  public getLogs(limit: number = 100): LogEntry[] {
    return this.logs.slice(-limit);
  }

  /**
   * Get logs by level
   * @param {LogLevel} level
   * @returns {LogEntry[]}
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Clear logs
   */
  public clear(): void {
    this.logs = [];
  }
}
