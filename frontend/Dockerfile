# 前端构建：Node 构建产物 → Nginx 静态托管（生产同源部署，/api 反向代理到 api 服务）。
FROM node:22-alpine AS build
WORKDIR /app

# 依赖层单独缓存：仅在 lock 文件变化时重新安装。
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS final

# 站点配置（静态资源 + /api 反代 + 缓存与安全响应头）
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
