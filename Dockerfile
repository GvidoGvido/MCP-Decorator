# ==========================================
# Multi-stage Dockerfile for MCP Decorator
# ==========================================

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (including dev tools like vite & esbuild)
COPY package*.json ./
RUN npm install

# Copy source files and compile both Vite frontend & Express backend
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Production runtime environment
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy compiled distribution artifacts from builder
COPY --from=builder /app/dist ./dist

# Run as non-root user for security hardening
USER node

# Container port
EXPOSE 3000

# Container health check against Express API
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the bundled Express + Vite static server
CMD ["node", "dist/server.cjs"]
