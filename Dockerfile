FROM oven/bun:1.10.2

WORKDIR /app

COPY bun.lockb package.json ./

RUN bun install --production

COPY . .

RUN bun prisma generate

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]