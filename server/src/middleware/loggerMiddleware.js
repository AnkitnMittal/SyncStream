import morgan from 'morgan';

const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

export const loggerMiddleware = morgan(logFormat);
