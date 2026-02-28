import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NominaView } from "@/components/nomina/NominaView";

export default async function NominaPage() {
  await getAuthUser();
  const clients = await prisma.client.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, portalToken: true },
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Nómina
      </h1>
      <NominaView clients={clients} />
    </div>
  );
}
