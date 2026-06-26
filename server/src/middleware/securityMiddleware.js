import helmet from 'helmet';

export const securityMiddleware = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false, // Permissive in dev if needed for tools
  crossOriginEmbedderPolicy: false,
});
