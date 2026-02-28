import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PortalClientView } from "@/components/portal/PortalClientView";

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const client = await prisma.client.findFirst({
    where: { portalToken: token, isActive: true },
  });
  if (!client) notFound();

  const clientData = {
    id: client.id,
    name: client.name,
    rfc: (client as { rfc?: string }).rfc ?? "",
    clavePatronal: (client as { clavePatronal?: string | null }).clavePatronal ?? "",
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Portal del cliente
        </h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          {clientData.name}
          {clientData.rfc && ` · RFC: ${clientData.rfc}`}
          {clientData.clavePatronal && ` · Clave patronal: ${clientData.clavePatronal}`}
        </p>
        <PortalClientView
          token={token}
          clientId={client.id}
          clientName={client.name}
        />
      </div>
    </div>
  );
}
