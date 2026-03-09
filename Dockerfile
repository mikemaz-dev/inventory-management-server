# ✅ Bun 1.2+ с Node.js 22+
FROM oven/bun:1.2-debian

WORKDIR /app

COPY bun.lock package.json ./

RUN bun install

COPY . .

RUN bunx prisma generate

RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]