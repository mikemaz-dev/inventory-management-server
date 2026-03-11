FROM oven/bun:1.2-debian

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY bun.lock package.json ./
RUN bun install

COPY . .

ENV DATABASE_URL="postgresql://placeholder:5432/placeholder"

RUN bunx prisma generate
RUN bun run build

EXPOSE 3000

CMD bunx prisma migrate deploy && bun run start