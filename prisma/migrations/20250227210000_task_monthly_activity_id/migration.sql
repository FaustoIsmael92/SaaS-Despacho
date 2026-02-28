-- AlterTable
ALTER TABLE "tasks" ADD COLUMN "monthly_activity_id" UUID;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_monthly_activity_id_fkey" FOREIGN KEY ("monthly_activity_id") REFERENCES "monthly_activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
