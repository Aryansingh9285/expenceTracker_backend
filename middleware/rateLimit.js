import rateLimit from 'express-rate-limit';

// Auth specific rate limiter: max 5 req per 15 min per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many auth attempts, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
});

// Global limiter: max 100 req per 15 min
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, slow down' },
  standardHeaders: true,
  legacyHeaders: false
});

