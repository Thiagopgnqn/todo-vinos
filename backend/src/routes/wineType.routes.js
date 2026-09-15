import { Router } from 'express';
import * as wineTypeController from '../controllers/wineType.controller.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { createWineTypeSchema } from '../validators/wineType.validator.js';

const router = Router();

// Public: list all wine types for filters and catalog
router.get('/', wineTypeController.getWineTypes);

// Admin only: create and delete wine types
router.post('/', auth, admin, validate(createWineTypeSchema), wineTypeController.createWineType);
router.delete('/:id', auth, admin, wineTypeController.deleteWineType);

export default router;

