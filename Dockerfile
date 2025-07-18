FROM node:20-alpine as build-stage

WORKDIR /app

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制依赖文件
COPY package.json pnpm-lock.yaml* ./

# 国内镜像源加速
RUN pnpm config set registry https://registry.npmmirror.com && \
    pnpm install --frozen-lockfile

# 复制源码并构建
COPY . .
RUN pnpm run build

# production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pm2

COPY --from=build-stage /app/package.json .
COPY --from=build-stage /app/pnpm-lock.yaml .
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/dist ./dist

COPY ecosystem.config.js ./

EXPOSE 3001

CMD ["pm2-runtime", "start", "dist/main.js"]
