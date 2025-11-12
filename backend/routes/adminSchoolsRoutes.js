import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';
import {
  getAdminSchools,
  getAdminSchoolDetail,
  updateAdminSchool
} from '../controllers/companyController.js';

const router = express.Router();

router.use(requireAuth);
router.use(checkAdmin);

router.get('/', getAdminSchools);
router.get('/:companyId', getAdminSchoolDetail);
router.put('/:companyId', updateAdminSchool);

export default router;

