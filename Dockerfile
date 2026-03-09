FROM oven/bun:1.2-debian

WORKDIR /app

COPY bun.lock package.json ./
RUN bun install

COPY . .

ENV DATABASE_URL="postgresql://inventory_management_8w8q_user:2Gz1pzkIROpnmMPJnFNog6Sh72pjm71r@dpg-d6nglt6a2pns738q5l3g-a/inventory_management_8w8q"

RUN bunx prisma generate


RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]