"use client";

import { useState, useEffect } from "react";

type Client = { id: string; name: string };
type Concept = { id: string; name: string };
type ReceiptItem = {
  id: string;
  conceptId: string;
  concept: { name: string };
  quantity: number;
  unitPrice: number;
  subtotal: number;
};
type Receipt = {
  id: string;
  folio: number;
  issueDate: string;
  totalAmount: number;
  client: { id: string; name: string };
  items: ReceiptItem[];
};

export function RecibosView() {
  const [clients, setClients] = useState<Client[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [rows, setRows] = useState<{ receipt: Receipt; item: ReceiptItem }[]>([]);
  const [filterClient, setFilterClient] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterConcept, setFilterConcept] = useState("");
  const [addReciboOpen, setAddReciboOpen] = useState(false);
  const [addConceptoOpen, setAddConceptoOpen] = useState(false);
  const [editRecibo, setEditRecibo] = useState<Receipt | null>(null);

  const loadClients = () =>
    fetch("/api/clients")
      .then((r) => r.json())
      .then((d) => setClients(Array.isArray(d) ? d : []));
  const loadConcepts = () =>
    fetch("/api/concepts")
      .then((r) => r.json())
      .then((d) => setConcepts(Array.isArray(d) ? d : []));

  const loadReceipts = () => {
    const params = new URLSearchParams();
    if (filterClient) params.set("clientId", filterClient);
    if (filterFrom) params.set("from", filterFrom);
    if (filterTo) params.set("to", filterTo);
    if (filterConcept) params.set("conceptId", filterConcept);
    fetch(`/api/receipts?${params}`)
      .then((r) => r.json())
      .then((receipts: Receipt[]) => {
        const flat: { receipt: Receipt; item: ReceiptItem }[] = [];
        for (const r of receipts) {
          for (const item of r.items) {
            flat.push({ receipt: r, item });
          }
        }
        setRows(flat);
      });
  };

  useEffect(() => {
    loadClients();
    loadConcepts();
  }, []);
  useEffect(() => {
    loadReceipts();
  }, [filterClient, filterFrom, filterTo, filterConcept]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setAddReciboOpen(true)}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Añadir recibo
        </button>
        <button
          type="button"
          onClick={() => setAddConceptoOpen(true)}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600 dark:text-zinc-200"
        >
          Añadir concepto
        </button>
      </div>
      <div className="flex flex-wrap gap-4 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <select
          value={filterClient}
          onChange={(e) => setFilterClient(e.target.value)}
          className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="">Todos los clientes</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
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
        <select
          value={filterConcept}
          onChange={(e) => setFilterConcept(e.target.value)}
          className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="">Todos los conceptos</option>
          {concepts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                Concepto
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-zinc-500">
                Cantidad
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-zinc-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {rows.map(({ receipt, item }) => (
              <tr
                key={`${receipt.id}-${item.id}`}
                onDoubleClick={() => setEditRecibo(receipt)}
                className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100">
                  {new Date(receipt.issueDate).toLocaleDateString("es-MX")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                  {receipt.client.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                  {item.concept.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                  {Number(item.subtotal).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <a
                    href={`/api/receipts/${receipt.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-2 text-sm text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    PDF
                  </a>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm("¿Eliminar este recibo?")) return;
                      await fetch(`/api/receipts/${receipt.id}`, {
                        method: "DELETE",
                      });
                      loadReceipts();
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">
            No hay registros con los filtros seleccionados.
          </p>
        )}
      </div>
      {addReciboOpen && (
        <AddReciboModal
          clients={clients}
          concepts={concepts}
          onClose={() => setAddReciboOpen(false)}
          onSaved={() => {
            setAddReciboOpen(false);
            loadReceipts();
          }}
        />
      )}
      {addConceptoOpen && (
        <AddConceptoModal
          concepts={concepts}
          onClose={() => setAddConceptoOpen(false)}
          onSaved={() => {
            setAddConceptoOpen(false);
            loadConcepts();
          }}
        />
      )}
      {editRecibo && (
        <EditReciboModal
          receipt={editRecibo}
          clients={clients}
          concepts={concepts}
          onClose={() => setEditRecibo(null)}
          onSaved={() => {
            setEditRecibo(null);
            loadReceipts();
          }}
        />
      )}
    </div>
  );
}

function AddReciboModal({
  clients,
  concepts,
  onClose,
  onSaved,
}: {
  clients: Client[];
  concepts: Concept[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<{ conceptId: string; quantity: number; unitPrice: number }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (concepts.length > 0 && items.length === 0) {
      setItems([{ conceptId: concepts[0].id, quantity: 1, unitPrice: 0 }]);
    }
  }, [concepts]);

  const addLine = () => {
    setItems((prev) => [...prev, { conceptId: concepts[0]?.id ?? "", quantity: 1, unitPrice: 0 }]);
  };

  const save = async () => {
    if (!clientId || items.length === 0) return;
    const body = {
      clientId,
      items: items.map((i) => ({
        conceptId: i.conceptId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.quantity * i.unitPrice,
      })),
    };
    setSaving(true);
    try {
      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) onSaved();
      else alert((await res.json()).error ?? "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold dark:text-zinc-100">Añadir recibo</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium dark:text-zinc-300">Cliente *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            >
              <option value="">Seleccionar</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {items.map((line, idx) => (
            <div key={idx} className="flex gap-2">
              <select
                value={line.conceptId}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((p, i) =>
                      i === idx ? { ...p, conceptId: e.target.value } : p
                    )
                  )
                }
                className="flex-1 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              >
                {concepts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                step={0.01}
                value={line.quantity}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((p, i) =>
                      i === idx ? { ...p, quantity: Number(e.target.value) || 0 } : p
                    )
                  )
                }
                className="w-20 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              />
              <input
                type="number"
                min={0}
                step={0.01}
                value={line.unitPrice}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((p, i) =>
                      i === idx ? { ...p, unitPrice: Number(e.target.value) || 0 } : p
                    )
                  )
                }
                className="w-24 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              />
            </div>
          ))}
          <button type="button" onClick={addLine} className="text-sm text-blue-600 hover:underline">
            + Otro concepto
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm dark:border-zinc-600 dark:text-zinc-300">
            Cancelar
          </button>
          <button type="button" onClick={save} disabled={saving} className="rounded bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function AddConceptoModal({
  concepts,
  onClose,
  onSaved,
}: {
  concepts: Concept[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) onSaved();
      else alert((await res.json()).error ?? "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold dark:text-zinc-100">Añadir concepto</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del concepto"
          className="w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
        />
        <ul className="mt-4 max-h-40 overflow-auto text-sm text-zinc-600 dark:text-zinc-400">
          {concepts.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm dark:border-zinc-600 dark:text-zinc-300">
            Cancelar
          </button>
          <button type="button" onClick={save} disabled={saving || !name.trim()} className="rounded bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function EditReciboModal({
  receipt,
  clients,
  concepts,
  onClose,
  onSaved,
}: {
  receipt: Receipt;
  clients: Client[];
  concepts: Concept[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [items, setItems] = useState(receipt.items.map((i) => ({ conceptId: i.conceptId, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice), subtotal: Number(i.subtotal) })));
  const [saving, setSaving] = useState(false);

  const addLine = () => {
    setItems((prev) => [...prev, { conceptId: concepts[0]?.id ?? "", quantity: 1, unitPrice: 0, subtotal: 0 }]);
  };

  const save = async () => {
    const body = {
      items: items.map((i) => ({
        conceptId: i.conceptId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.quantity * i.unitPrice,
      })),
    };
    setSaving(true);
    try {
      const res = await fetch(`/api/receipts/${receipt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) onSaved();
      else alert((await res.json()).error ?? "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold dark:text-zinc-100">Editar recibo (folio {receipt.folio})</h2>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">Cliente: {receipt.client.name}</p>
        <div className="space-y-3">
          {items.map((line, idx) => (
            <div key={idx} className="flex gap-2">
              <select
                value={line.conceptId}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((p, i) =>
                      i === idx ? { ...p, conceptId: e.target.value } : p
                    )
                  )
                }
                className="flex-1 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              >
                {concepts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                step={0.01}
                value={line.quantity}
                onChange={(e) => {
                  const v = Number(e.target.value) || 0;
                  setItems((prev) =>
                    prev.map((p, i) =>
                      i === idx ? { ...p, quantity: v, subtotal: v * p.unitPrice } : p
                    )
                  );
                }}
                className="w-20 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              />
              <input
                type="number"
                min={0}
                step={0.01}
                value={line.unitPrice}
                onChange={(e) => {
                  const v = Number(e.target.value) || 0;
                  setItems((prev) =>
                    prev.map((p, i) =>
                      i === idx ? { ...p, unitPrice: v, subtotal: p.quantity * v } : p
                    )
                  );
                }}
                className="w-24 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              />
            </div>
          ))}
          <button type="button" onClick={addLine} className="text-sm text-blue-600 hover:underline">
            + Otro concepto
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm dark:border-zinc-600 dark:text-zinc-300">
            Cancelar
          </button>
          <button type="button" onClick={save} disabled={saving} className="rounded bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
