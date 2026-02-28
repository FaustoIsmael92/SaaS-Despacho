-- CreateTable
CREATE TABLE "dashboard_messages" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "content" VARCHAR(2000) NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dashboard_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dashboard_messages_user_id_idx" ON "dashboard_messages"("user_id");

-- CreateIndex
CREATE INDEX "dashboard_messages_is_pinned_idx" ON "dashboard_messages"("is_pinned");

-- AddForeignKey
ALTER TABLE "dashboard_messages" ADD CONSTRAINT "dashboard_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
