"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1/products', productRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Categorization Service is running' });
});
app.use((err, req, res, next) => {
    logger_1.logger.error('Unhandled Rejection:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ success: false, error: message });
});
exports.default = app;
