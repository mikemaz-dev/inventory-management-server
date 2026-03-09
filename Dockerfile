FROM oven/bun:1.2-debian

WORKDIR /app

COPY bun.lockb package.json ./
RUN bun install

COPY . .

ENV DATABASE_URL="postgresql://placeholder:5432/placeholder"

RUN bunx prisma generate

RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]