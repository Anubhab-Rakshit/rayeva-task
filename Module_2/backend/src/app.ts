import express, { Express, ErrorRequestHandler } from 'express';
import cors from 'cors';
import { logger } from './utils/logger';
import proposalRoutes from './routes/proposalRoutes';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/proposals', proposalRoutes);

// Global Error Handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error('Unhandled Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal Server Error',
    });
};

app.use(errorHandler);

export default app;
