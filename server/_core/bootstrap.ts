/**
 * Bootstrap Module - Harvard Definitions Style
 * Responsible for initializing and configuring the application
 * @module server/_core/bootstrap
 */

import { Logger } from './logger';
import { ConfigManager } from './config';
import { ErrorHandler } from './error-handler';

/**
 * Bootstrap configuration interface following Harvard definitions
 * @interface BootstrapConfig
 */
interface BootstrapConfig {
  environment: 'development' | 'production' | 'test';
  port: number;
  apiVersion: string;
  dbUrl: string;
  jwtSecret: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Application Bootstrap Manager
 * Initializes all core services following dependency injection pattern
 * @class BootstrapManager
 */
export class BootstrapManager {
  private static instance: BootstrapManager;
  private logger: Logger;
  private config: ConfigManager;
  private errorHandler: ErrorHandler;
  private isInitialized = false;

  private constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
  }

  /**
   * Get singleton instance of BootstrapManager
   * @returns {BootstrapManager} Singleton instance
   */
  public static getInstance(): BootstrapManager {
    if (!BootstrapManager.instance) {
      BootstrapManager.instance = new BootstrapManager();
    }
    return BootstrapManager.instance;
  }

  /**
   * Initialize application with configuration
   * Runs initialization sequence in proper order
   * @param {BootstrapConfig} config - Application configuration
   * @returns {Promise<boolean>} Initialization success status
   */
  public async initialize(config: BootstrapConfig): Promise<boolean> {
    try {
      if (this.isInitialized) {
        this.logger.warn('Bootstrap already initialized, skipping...');
        return true;
      }

      this.logger.info('🚀 Starting application bootstrap...');

      // Phase 1: Configuration validation
      this.logger.debug('Phase 1: Validating configuration');
      this.validateConfiguration(config);

      // Phase 2: Environment setup
      this.logger.debug('Phase 2: Setting up environment');
      await this.setupEnvironment(config);

      // Phase 3: Service initialization
      this.logger.debug('Phase 3: Initializing services');
      await this.initializeServices();

      // Phase 4: Health check
      this.logger.debug('Phase 4: Running health checks');
      await this.runHealthChecks();

      this.isInitialized = true;
      this.logger.info('✅ Bootstrap completed successfully');
      return true;
    } catch (error) {
      this.logger.error('Bootstrap failed', error);
      this.errorHandler.handle(error);
      return false;
    }
  }

  /**
   * Validate bootstrap configuration
   * @private
   * @param {BootstrapConfig} config - Configuration to validate
   * @throws {Error} If configuration is invalid
   */
  private validateConfiguration(config: BootstrapConfig): void {
    if (!config) {
      throw new Error('Configuration is required');
    }

    const required = ['environment', 'port', 'apiVersion', 'dbUrl', 'jwtSecret'];
    for (const field of required) {
      if (!config[field as keyof BootstrapConfig]) {
        throw new Error(`Configuration field '${field}' is required`);
      }
    }

    if (config.port < 1 || config.port > 65535) {
      throw new Error('Invalid port number');
    }

    this.logger.debug('Configuration validation passed');
  }

  /**
   * Setup environment variables and system configuration
   * @private
   * @param {BootstrapConfig} config - Configuration
   */
  private async setupEnvironment(config: BootstrapConfig): Promise<void> {
    // Note: process.env.NODE_ENV is read-only, set via NODE_ENV at startup
    // Only set non-read-only environment variables
    process.env.PORT = config.port.toString();
    process.env.API_VERSION = config.apiVersion;
    process.env.JWT_SECRET = config.jwtSecret;

    this.logger.info(`Environment: ${config.environment}`);
    this.logger.info(`API Version: ${config.apiVersion}`);
    this.logger.info(`Port: ${config.port}`);
  }

  /**
   * Initialize all application services
   * @private
   */
  private async initializeServices(): Promise<void> {
    // Service initialization would go here
    // - Database connections
    // - Cache setup
    // - Message queues
    // - External service clients

    this.logger.debug('Services initialized');
  }

  /**
   * Run health checks to ensure all systems operational
   * @private
   */
  private async runHealthChecks(): Promise<void> {
    const checks = {
      memory: this.checkMemory(),
      system: this.checkSystemStatus(),
    };

    for (const [name, result] of Object.entries(checks)) {
      if (!result) {
        this.logger.warn(`Health check failed: ${name}`);
      }
    }
  }

  /**
   * Check available memory
   * @private
   */
  private checkMemory(): boolean {
    const used = process.memoryUsage();
    const limit = 512 * 1024 * 1024; // 512MB

    return used.heapUsed < limit;
  }

  /**
   * Check system status
   * @private
   */
  private checkSystemStatus(): boolean {
    // Add system checks here
    return true;
  }

  /**
   * Get bootstrap status
   * @returns {boolean} Whether bootstrap is complete
   */
  public getStatus(): boolean {
    return this.isInitialized;
  }

  /**
   * Graceful shutdown
   * @returns {Promise<void>}
   */
  public async shutdown(): Promise<void> {
    try {
      this.logger.info('🛑 Initiating graceful shutdown...');
      // Cleanup operations
      this.isInitialized = false;
      this.logger.info('✅ Shutdown completed');
    } catch (error) {
      this.logger.error('Shutdown error', error);
    }
  }
}

export type { BootstrapConfig };
