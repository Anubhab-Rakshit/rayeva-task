"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./utils/logger");
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    logger_1.logger.info(`Server is running on port ${PORT}`);
    logger_1.logger.info(`Send POST requests to http://localhost:${PORT}/api/v1/products/analyze`);
});
