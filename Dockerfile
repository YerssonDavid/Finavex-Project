# Stage 1: Dependencies
FROM oven/bun:latest AS dependencies
WORKDIR /app

# Copy package files
COPY bun.lock .
COPY package.json .
COPY frontend/package.json ./frontend/
COPY frontend/bun.lock ./frontend/

# Install root dependencies
RUN bun install --frozen-lockfile

# Install frontend dependencies
WORKDIR /app/frontend
RUN bun install --frozen-lockfile


# Stage 2: Builder
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/frontend/node_modules ./frontend/node_modules

# Copy project files
COPY bun.lock .
COPY package.json .
COPY frontend ./frontend

# Build the application with standalone output
WORKDIR /app/frontend
RUN bun run build


# Stage 3: Production - Optimized with Standalone Output
FROM oven/bun:latest
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

# Copy standalone output from builder (much smaller than copying all node_modules)
COPY --from=builder /app/frontend/.next/standalone ./

# Copy static files (public and .next/static)
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next/static ./.next/static

# Expose port 3000
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application directly with node (included in standalone build)
CMD ["node", "server.js"]
