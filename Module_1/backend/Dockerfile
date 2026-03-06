# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configurations
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev) to compile typescript
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build the TypeScript project
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine

WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3000

# Set user for security
USER node

# Start the application
CMD ["npm", "start"]
