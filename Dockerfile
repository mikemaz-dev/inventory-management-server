FROM oven/bun:1.1

WORKDIR /app

COPY bun.lockb package.json ./

RUN bun install

COPY . .

RUN bunx prisma generate

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]