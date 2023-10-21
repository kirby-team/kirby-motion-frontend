FROM node:18-alpine AS base
 
ARG GITHUB_SHA
ENV GITHUB_SHA=$GITHUB_SHA

ENV NODE_OPTIONS="--max-old-space-size=8192"

FROM base AS builder
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=kirby-motion-app --docker

# Add lockfile and package.json of isolate subworkspace
FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/tsconfig.json ./tsconfig.json
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
RUN yarn turbo run build --filter=kirby-motion-app

FROM base AS runner
WORKDIR /app
ENV NODE_ENV="production"
ENV NODE_OPTIONS="-r /app/.pnp.cjs --loader /app/.pnp.loader.mjs"

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/services/kirby-motion-app/next.config.mjs .
COPY --from=installer --chown=nextjs:nodejs /app/services/kirby-motion-app/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/services/kirby-motion-app/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/services/kirby-motion-app/scripts ./services/kirby-motion-app/scripts
COPY --from=installer --chown=nextjs:nodejs /app/services/kirby-motion-app/.next/static ./services/kirby-motion-app/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/services/kirby-motion-app/public ./services/kirby-motion-app/public

ENTRYPOINT node services/kirby-motion-app/scripts/env/parse-env.mjs && node services/kirby-motion-app/server.js