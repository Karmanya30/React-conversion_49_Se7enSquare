import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 5000, // Relaxed for local dev
  standardHeaders: true,
  legacyHeaders: false,
  message: () => ({
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    timestamp: new Date().toISOString(),
  }),
});

export const sensitiveRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 30 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: () => ({
    success: false,
    statusCode: 429,
    message: 'Too many sensitive requests from this IP, please try again later',
    timestamp: new Date().toISOString(),
  }),
});
