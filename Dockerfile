# Stage 1: Install dependencies
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY /prisma ./prisma
RUN npm ci

# Stage 2: Build the application
FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production server
FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]