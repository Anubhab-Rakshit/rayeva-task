import { Router } from 'express';
import multer from 'multer';
import { productController } from '../controllers/productController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Define API endpoints
router.post('/analyze', productController.processProductMetadata);
router.get('/stats', productController.getStats);
router.put('/:id/override', productController.overrideProductMetadata);
router.post('/extract-vision', upload.single('image'), productController.extractVision);
router.post('/scrape', productController.scrapeUrl);

export default router;
