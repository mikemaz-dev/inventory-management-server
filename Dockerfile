FROM oven/bun:1.2-debian

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
RUN bunx prisma generate

COPY . .

RUN bun run build

EXPOSE 3000

CMD bunx prisma migrate deploy && bun run start