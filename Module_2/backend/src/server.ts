import app from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3001; // Using 3001 to avoid conflict with Module 1 which is on 3000

app.listen(PORT, () => {
    logger.info(`B2B Proposal Generator Backend running on port ${PORT}`);
});
