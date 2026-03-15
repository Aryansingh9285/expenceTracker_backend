import { body } from 'express-validator';

// Register validator
export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name required').isLength({ max: 50 }).withMessage('Name too long'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password min 8 chars')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).withMessage('Password: 1 upper, 1 lower, 1 number')
];

// Login validator
export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

// Transaction validator
export const transactionValidator = [
  body('type').isIn(['income', 'expense']).withMessage('Type must be income/expense'),
  body('category').trim().notEmpty().withMessage('Category required').isLength({ max: 50 }),
  body('amount').isFloat({ min: 0 }).withMessage('Amount >= 0')
];

