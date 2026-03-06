import { Router } from 'express';
import { proposalController } from '../controllers/proposalController';

const router = Router();

router.post('/generate', proposalController.generateProposal);
router.post('/refine', proposalController.refineProposal);

export default router;
