-- AlterTable: add RFC (required) and clave patronal (optional) to clients
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "rfc" VARCHAR(20);
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "clave_patronal" VARCHAR(50);

-- Backfill existing rows: set rfc to empty string if null (required by schema)
UPDATE "clients" SET "rfc" = '' WHERE "rfc" IS NULL;
ALTER TABLE "clients" ALTER COLUMN "rfc" SET NOT NULL;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "clients_rfc_idx" ON "clients"("rfc");
