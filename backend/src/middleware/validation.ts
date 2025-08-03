import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createError } from './errorHandler.js';

const createDecisionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  detail: z.string().min(1, 'Detail is required'),
  project: z.string().min(1, 'Project is required'),
  dueAt: z.string().datetime('Invalid date format'),
  teamMemberEmails: z.array(z.string().email('Invalid email')).min(1, 'At least one team member required')
});

const updateReceiptSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  stance: z.enum(['AGREE']).nullable()
});

export const validateCreateDecision = (req: Request, res: Response, next: NextFunction) => {
  try {
    createDecisionSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => e.message).join(', ');
      next(createError(`Validation error: ${message}`, 400));
    } else {
      next(createError('Invalid request data', 400));
    }
  }
};

export const validateUpdateReceipt = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateReceiptSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => e.message).join(', ');
      next(createError(`Validation error: ${message}`, 400));
    } else {
      next(createError('Invalid request data', 400));
    }
  }
}; 