import rateLimit from 'express-rate-limit';

export const submissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { error: 'Too many submissions, please try again later.' },
});
