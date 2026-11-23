# Stage 1: Build the Angular application
FROM node:22-slim AS builder
LABEL stage="builder"

WORKDIR /app

ENV NODE_OPTIONS=--max-old-space-size=4096
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV PNPM_CONFIG_STRICT_DEP_BUILDS=false
ENV PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --frozen-lockfile --prefer-offline

# Copy the rest of the application source code (including libs/ngx-dataclouder submodule)
COPY . .

# Overwrite the default config.json with the chosen config file
ARG CONFIG_FILE=config.m6.json
RUN cp public/${CONFIG_FILE} public/config.json

# Build the application for production (run ng directly to skip prebuild's version-patch step)
RUN pnpm exec ng build -c production

# Pre-compress static assets so nginx can serve them with gzip_static
RUN find /app/www/browser -type f \
      \( -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.svg" \
         -o -name "*.json" -o -name "*.txt" -o -name "*.ico" -o -name "*.map" \) \
      -size +256c \
      -exec gzip -9 -k {} \;

# Stage 2: Serve the application with Nginx
FROM nginx:1.27-alpine-slim AS runner
LABEL stage="runner"

COPY --from=builder /app/www/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
