"use client";

import { useState, useEffect } from "react";

type Client = { id: string; name: string; portalToken: string };
type PayrollEvent = {
  id: string;
  eventType: string;
  startDate: string;
  endDate: string | null;
  notes: string | null;
  employee?: { firstName: string; lastName: string };
  client?: { name: string };
};

export function NominaView({
  clients,
}: {
  clients: Client[];
}) {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [copied, setCopied] = useState(false);
  const [filterClient, setFilterClient] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [registros, setRegistros] = useState<PayrollEvent[]>([]);
  const [addEmpleadoOpen, setAddEmpleadoOpen] = useState(false);

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const portalUrl =
    typeof window !== "undefined" && selectedClient
      ? `${window.location.origin}/portal/${selectedClient.portalToken}`
      : "";

  const copyLink = () => {
    if (!portalUrl) return;
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterClient) params.set("clientId", filterClient);
    if (filterType) params.set("eventType", filterType);
    if (filterFrom) params.set("from", filterFrom);
    if (filterTo) params.set("to", filterTo);
    fetch(`/api/payroll-events?${params}`)
      .then((r) => r.json())
      .then((d) => setRegistros(Array.isArray(d) ? d : []))
      .catch(() => setRegistros([]));
  }, [filterClient, filterType, filterFrom, filterTo]);

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Contribuyente
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">Seleccionar cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={copyLink}
            disabled={!selectedClient}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {copied ? "¡Copiado!" : "Generar"}
          </button>
          <button
            type="button"
            onClick={() => setAddEmpleadoOpen(true)}
            disabled={!selectedClient}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            Añadir empleados
          </button>
        </div>
        {copied && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            Enlace copiado al portapapeles.
          </p>
        )}
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Registros
        </h2>
        <div className="mb-4 flex flex-wrap gap-4">
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">Todos los clientes</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">Todos los tipos</option>
            <option value="alta">Alta</option>
            <option value="baja">Baja</option>
            <option value="incapacidad">Incapacidad</option>
            <option value="vacaciones">Vacaciones</option>
          </select>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">Empleado</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {registros.map((r) => (
                <tr key={r.id} className="bg-white dark:bg-zinc-900">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100">
                    {new Date(r.startDate).toLocaleDateString("es-MX")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {r.client?.name ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm capitalize">{r.eventType}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : "—"}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-sm text-zinc-500">{r.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {registros.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">
            No hay registros con los filtros seleccionados.
          </p>
        )}
      </section>

      {addEmpleadoOpen && selectedClientId && (
        <AddEmpleadoModal
          clientId={selectedClientId}
          token={selectedClient?.portalToken ?? ""}
          onClose={() => setAddEmpleadoOpen(false)}
        />
      )}
    </div>
  );
}

function AddEmpleadoModal({
  token,
  clientId,
  onClose,
}: {
  token: string;
  clientId: string;
  onClose: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [curp, setCurp] = useState("");
  const [nss, setNss] = useState("");
  const [rfc, setRfc] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [hireDate, setHireDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/portal/${token}/alta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          firstName,
          lastName,
          curp,
          nss,
          rfc,
          postalCode,
          hireDate,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        return;
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold dark:text-zinc-100">Añadir empleado</h2>
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}
        <form onSubmit={save} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium dark:text-zinc-300">Nombres *</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-zinc-300">Primer apellido *</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium dark:text-zinc-300">CURP *</label>
              <input value={curp} onChange={(e) => setCurp(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2 uppercase dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-zinc-300">NSS (11 dígitos) *</label>
              <input value={nss} onChange={(e) => setNss(e.target.value)} required maxLength={11} pattern="[0-9]{11}" className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium dark:text-zinc-300">RFC (13 caracteres) *</label>
              <input value={rfc} onChange={(e) => setRfc(e.target.value)} required maxLength={13} className="mt-1 w-full rounded border px-3 py-2 uppercase dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-zinc-300">Código postal *</label>
              <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-zinc-300">Fecha de alta *</label>
            <input type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm dark:border-zinc-600 dark:text-zinc-300">
              Cancelar
            </button>
            <button disabled={saving} type="submit" className="rounded bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
