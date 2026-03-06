#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}    🚀 Starting ForgeProcure / EchoSynthetics    ${NC}"
echo -e "${BLUE}================================================${NC}"

# Start Module 1 Backend
echo -e "${YELLOW}Starting Module 1 Backend (Port 3000)...${NC}"
cd Module_1/backend
npm install
npm run dev bg > /dev/null 2>&1 &
M1_BACKEND_PID=$!
cd ../..

# Start Module 1 Frontend
echo -e "${YELLOW}Starting Module 1 Frontend (Port 5173)...${NC}"
cd Module_1/frontend
npm install
npm run dev bg > /dev/null 2>&1 &
M1_FRONTEND_PID=$!
cd ../..

# Start Module 2 Backend
echo -e "${YELLOW}Starting Module 2 Backend (Port 3001)...${NC}"
cd Module_2/backend
npm install
npm run dev bg > /dev/null 2>&1 &
M2_BACKEND_PID=$!
cd ../..

# Start Module 2 Frontend
echo -e "${YELLOW}Starting Module 2 Frontend (Port 5174)...${NC}"
cd Module_2/frontend
npm install
npm run dev bg > /dev/null 2>&1 &
M2_FRONTEND_PID=$!
cd ../..

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN} ✅ ALL SERVICES STARTED!                       ${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "To view Module 1 (Catalog) & Architecture Docs:"
echo -e "${BLUE}👉 http://localhost:5173${NC}"
echo ""
echo -e "To view Module 2 (Proposal Generator):"
echo -e "${BLUE}👉 http://localhost:5174${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services.${NC}"

# Wait for all background processes
trap "kill -9 $M1_BACKEND_PID $M1_FRONTEND_PID $M2_BACKEND_PID $M2_FRONTEND_PID; echo -e '\n${BLUE}All services stopped.${NC}'; exit" SIGINT SIGTERM

wait
