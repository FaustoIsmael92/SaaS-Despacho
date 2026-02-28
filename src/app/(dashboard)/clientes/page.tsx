import { getAuthUser } from "@/lib/auth";
import { ClientesView } from "@/components/clientes/ClientesView";

export default async function ClientesPage() {
  await getAuthUser();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Añadir cliente
      </h1>
      <ClientesView />
    </div>
  );
}
