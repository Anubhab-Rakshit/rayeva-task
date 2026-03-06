"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/analyze', productController_1.productController.processProductMetadata);
router.get('/stats', productController_1.productController.getStats);
router.put('/:id/override', productController_1.productController.overrideProductMetadata);
router.post('/extract-vision', upload.single('image'), productController_1.productController.extractVision);
router.post('/scrape', productController_1.productController.scrapeUrl);
exports.default = router;
