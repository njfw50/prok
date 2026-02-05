/**
 * Configuration Manager - Harvard Configuration Management
 * Centralized configuration with validation and environment support
 * @module server/_core/config
 */

/**
 * Configuration schema interface
 * @interface AppConfig
 */
interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
    port: number;
    apiVersion: string;
  };
  database: {
    url: string;
    maxConnections: number;
    timeout: number;
  };
  security: {
    jwtSecret: string;
    jwtExpiration: string;
    hashRounds: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    maxSize: number;
  };
  features: {
    enableWebSocket: boolean;
    enableMultiplayer: boolean;
    enableAnalytics: boolean;
  };
}

/**
 * Configuration Manager - Singleton pattern
 * @class ConfigManager
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfiguration();
  }

  /**
   * Get singleton instance
   * @returns {ConfigManager}
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Load configuration from environment
   * @private
   * @returns {AppConfig}
   */
  private loadConfiguration(): AppConfig {
    return {
      app: {
        name: process.env.APP_NAME || 'Karaoke Pro',
        version: process.env.API_VERSION || '1.0.0',
        environment: (process.env.NODE_ENV || 'development') as any,
        port: parseInt(process.env.PORT || '8080', 10),
        apiVersion: process.env.API_VERSION || 'v1',
      },
      database: {
        url: process.env.DATABASE_URL || 'postgresql://localhost/karaoke',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
        timeout: parseInt(process.env.DB_TIMEOUT || '30000', 10),
      },
      security: {
        jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
        jwtExpiration: process.env.JWT_EXPIRATION || '24h',
        hashRounds: parseInt(process.env.HASH_ROUNDS || '10', 10),
      },
      logging: {
        level: (process.env.LOG_LEVEL || 'info') as any,
        maxSize: parseInt(process.env.LOG_MAX_SIZE || '10000', 10),
      },
      features: {
        enableWebSocket: process.env.ENABLE_WEBSOCKET !== 'false',
        enableMultiplayer: process.env.ENABLE_MULTIPLAYER !== 'false',
        enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false',
      },
    };
  }

  /**
   * Get entire configuration
   * @returns {AppConfig}
   */
  public getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Get specific configuration section
   * @template K
   * @param {K} section
   * @returns {AppConfig[K]}
   */
  public getSection<K extends keyof AppConfig>(section: K): AppConfig[K] {
    return this.config[section];
  }

  /**
   * Get specific configuration value
   * @param {string} path - Dot notation path (e.g., 'app.port')
   * @returns {any}
   */
  public getValue(path: string): any {
    const parts = path.split('.');
    let value: any = this.config;

    for (const part of parts) {
      value = value?.[part];
    }

    return value;
  }

  /**
   * Check if in development mode
   * @returns {boolean}
   */
  public isDevelopment(): boolean {
    return this.config.app.environment === 'development';
  }

  /**
   * Check if in production mode
   * @returns {boolean}
   */
  public isProduction(): boolean {
    return this.config.app.environment === 'production';
  }

  /**
   * Validate configuration completeness
   * @returns {boolean}
   */
  public validate(): boolean {
    const required = [
      'app.name',
      'app.port',
      'security.jwtSecret',
      'logging.level',
    ];

    for (const path of required) {
      if (!this.getValue(path)) {
        throw new Error(`Missing required configuration: ${path}`);
      }
    }

    return true;
  }
}

export type { AppConfig };
