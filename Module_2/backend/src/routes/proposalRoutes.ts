import { Router } from 'express';
import { proposalController } from '../controllers/proposalController';

const router = Router();

router.post('/generate', proposalController.generateProposal);

export default router;
