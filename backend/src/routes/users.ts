import { Router } from 'express';
import { getUsers, getUser } from '../controllers/users.js';

const router = Router();

// GET /api/users - Get all users
router.get('/', getUsers);

// GET /api/users/:id - Get a specific user
router.get('/:id', getUser);

export { router as usersRouter }; 