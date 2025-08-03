import { Router } from 'express';
import { getDecisions, getDecision, createDecision, updateReceipt } from '../controllers/decisions.js';
import { validateCreateDecision, validateUpdateReceipt } from '../middleware/validation.js';

const router = Router();

// GET /api/decisions - Get all decisions
router.get('/', getDecisions);

// GET /api/decisions/:id - Get a specific decision
router.get('/:id', getDecision);

// POST /api/decisions - Create a new decision
router.post('/', validateCreateDecision, createDecision);

// PUT /api/decisions/:id/receipts - Update a receipt for a decision
router.put('/:id/receipts', validateUpdateReceipt, updateReceipt);

export { router as decisionsRouter }; 