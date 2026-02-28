import { getAuthUser } from "@/lib/auth";
import { DashboardLayout } from "./DashboardLayout";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) return null;

  return (
    <div className="h-full">
      <DashboardLayout userId={user.id} />
    </div>
  );
}
