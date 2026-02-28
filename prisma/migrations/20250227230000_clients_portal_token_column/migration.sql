-- Fix: ensure clients.portal_token exists (Prisma expects @map("portal_token"))
-- If the column was created as "portalToken" (camelCase), rename it to "portal_token".

DO $$
BEGIN
  -- PostgreSQL: unquoted names are lowercased, so "portalToken" in DB would need to be quoted
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clients' AND column_name = 'portalToken'
  ) THEN
    ALTER TABLE "clients" RENAME COLUMN "portalToken" TO "portal_token";
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clients' AND column_name = 'portal_token'
  ) THEN
    -- Column missing: add it (e.g. table created manually or from another source)
    ALTER TABLE "clients" ADD COLUMN "portal_token" VARCHAR(255);
    UPDATE "clients" SET "portal_token" = gen_random_uuid()::text WHERE "portal_token" IS NULL;
    ALTER TABLE "clients" ALTER COLUMN "portal_token" SET NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS "clients_portal_token_key" ON "clients"("portal_token");
  END IF;
END $$;
