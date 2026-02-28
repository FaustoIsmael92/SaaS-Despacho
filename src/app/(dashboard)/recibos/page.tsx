import { getAuthUser } from "@/lib/auth";
import { RecibosView } from "@/components/recibos/RecibosView";

export default async function RecibosPage() {
  await getAuthUser();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Recibos
      </h1>
      <RecibosView />
    </div>
  );
}
