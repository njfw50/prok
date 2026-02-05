import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import net from 'net';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { registerOAuthRoutes } from './oauth';
import { appRouter } from '../routers';
import { createContext } from './context';

// Harvard-style core modules
import { BootstrapManager } from './bootstrap';
import { Logger } from './logger';
import { ConfigManager } from './config';
import { ErrorHandler } from './error-handler';
import {
  requestIdMiddleware,
  loggingMiddleware,
  errorHandlingMiddleware,
  corsMiddleware,
  securityHeadersMiddleware,
  rateLimitMiddleware,
} from './middleware';

const logger = Logger.getInstance();
const configManager = ConfigManager.getInstance();
const errorHandler = ErrorHandler.getInstance();
const bootstrapManager = BootstrapManager.getInstance();

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  try {
    // Phase 1: Bootstrap initialization
    const bootstrapSuccess = await bootstrapManager.initialize({
      environment: (process.env.NODE_ENV as any) || 'development',
      port: parseInt(process.env.PORT || '3000', 10),
      apiVersion: 'v1',
      dbUrl: process.env.DATABASE_URL || 'postgresql://localhost/karaoke',
      jwtSecret: process.env.JWT_SECRET || 'dev-secret',
      logLevel: (process.env.LOG_LEVEL as any) || 'info',
    });

    if (!bootstrapSuccess) {
      logger.error('Bootstrap failed, cannot start server');
      process.exit(1);
    }

    // Phase 2: Express app setup
    const app = express();
    const server = createServer(app);

    // Phase 3: Apply middleware in correct order
    logger.debug('Applying middleware stack');

    // Request identification and security
    app.use(requestIdMiddleware);
    app.use(securityHeadersMiddleware);
    app.use(corsMiddleware);

    // Body parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging and rate limiting
    app.use(loggingMiddleware);
    app.use(rateLimitMiddleware(100)); // 100 requests per minute

    // Phase 4: Routes
    app.use('/api/oauth', registerOAuthRoutes(app));
    app.use(
      '/api/trpc',
      createExpressMiddleware({
        router: appRouter,
        createContext,
      }),
    );

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
      });
    });

    // Phase 5: Error handling (must be last)
    app.use((req, res) => {
      const error = ErrorHandler.createNotFoundError('Endpoint');
      errorHandlingMiddleware(error, req, res, () => {});
    });

    app.use(errorHandlingMiddleware);

    // Phase 6: Start server
    const port = await findAvailablePort(parseInt(process.env.PORT || '3000', 10));

    server.listen(port, () => {
      logger.info(`✅ Server running on http://localhost:${port}`);
      logger.info(`📝 API Version: v1`);
      logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown handler
    process.on('SIGTERM', async () => {
      logger.warn('SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await bootstrapManager.shutdown();
        process.exit(0);
      });
    });

    // Error handlers
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', {
        reason,
        promise: String(promise),
      });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', error);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer().catch(console.error);
