"use client";

import { useEffect, useState } from "react";

type View = "menu" | "alta" | "baja" | "incapacidad" | "vacaciones";

export function PortalClientView({
  token,
  clientId,
  clientName,
}: {
  token: string;
  clientId: string;
  clientName: string;
}) {
  const [view, setView] = useState<View>("menu");
  const [success, setSuccess] = useState(false);

  if (view === "menu") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setView("alta")}
          className="rounded-lg border-2 border-zinc-200 bg-white p-6 text-left font-medium hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
        >
          Alta
        </button>
        <button
          type="button"
          onClick={() => setView("baja")}
          className="rounded-lg border-2 border-zinc-200 bg-white p-6 text-left font-medium hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
        >
          Baja
        </button>
        <button
          type="button"
          onClick={() => setView("incapacidad")}
          className="rounded-lg border-2 border-zinc-200 bg-white p-6 text-left font-medium hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
        >
          Incapacidad
        </button>
        <button
          type="button"
          onClick={() => setView("vacaciones")}
          className="rounded-lg border-2 border-zinc-200 bg-white p-6 text-left font-medium hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
        >
          Vacaciones
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setView("menu")}
        className="mb-4 text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </button>
      {view === "alta" && (
        <PortalAltaForm
          token={token}
          clientId={clientId}
          onSuccess={() => setSuccess(true)}
        />
      )}
      {view === "baja" && (
        <PortalBajaForm
          token={token}
          clientId={clientId}
          onSuccess={() => setSuccess(true)}
        />
      )}
      {view === "incapacidad" && (
        <PortalIncapacidadForm
          token={token}
          clientId={clientId}
          onSuccess={() => setSuccess(true)}
        />
      )}
      {view === "vacaciones" && (
        <PortalVacacionesForm
          token={token}
          clientId={clientId}
          onSuccess={() => setSuccess(true)}
        />
      )}
      {success && (
        <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-800 dark:bg-green-900/30 dark:text-green-200">
          Se ha registrado correctamente.
        </div>
      )}
    </div>
  );
}

function PortalAltaForm({
  token,
  clientId,
  onSuccess,
}: {
  token: string;
  clientId: string;
  onSuccess: () => void;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bajas, setBajas] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);

  const loadBajas = () => {
    fetch(`/api/portal/${token}/employees?status=baja`)
      .then((r) => r.json())
      .then((d) => setBajas(Array.isArray(d) ? d : []))
      .catch(() => setBajas([]));
  };

  useEffect(() => {
    loadBajas();
  }, [token]);

  const reactivate = async (employeeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/${token}/reactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Error al reactivar");
        return;
      }
      loadBajas();
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold dark:text-zinc-100">Alta de empleado</h2>
      <p className="text-sm text-zinc-500">
        Campos obligatorios: nombres, apellidos, CURP, NSS (11 dígitos), RFC (13 caracteres), código postal, fecha de alta.
      </p>
      {error && (
        <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
          {error}
        </div>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
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
              setError(data.error ?? "Error al registrar alta");
              return;
            }
            setFirstName("");
            setLastName("");
            setCurp("");
            setNss("");
            setRfc("");
            setPostalCode("");
            setHireDate(new Date().toISOString().slice(0, 10));
            onSuccess();
          } finally {
            setLoading(false);
          }
        }}
        className="mt-4 space-y-3"
      >
        <input type="hidden" name="clientId" value={clientId} />
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Nombres *</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Primer apellido *</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">CURP *</label>
          <input
            value={curp}
            onChange={(e) => setCurp(e.target.value)}
            required
            className="mt-1 w-full rounded border px-3 py-2 uppercase dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">NSS (11 dígitos) *</label>
          <input
            value={nss}
            onChange={(e) => setNss(e.target.value)}
            required
            maxLength={11}
            pattern="[0-9]{11}"
            className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">RFC (13 caracteres) *</label>
          <input
            value={rfc}
            onChange={(e) => setRfc(e.target.value)}
            required
            maxLength={13}
            className="mt-1 w-full rounded border px-3 py-2 uppercase dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Código postal *</label>
          <input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Fecha de alta *</label>
          <input
            type="date"
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
            required
            className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? "Enviando…" : "Enviar"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Empleados dados de baja (reactivar)
        </h3>
        {bajas.length === 0 ? (
          <p className="text-sm text-zinc-500">No hay empleados de baja.</p>
        ) : (
          <ul className="space-y-2">
            {bajas.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              >
                <span className="text-zinc-900 dark:text-zinc-100">
                  {e.firstName} {e.lastName}
                </span>
                <button
                  type="button"
                  onClick={() => reactivate(e.id)}
                  disabled={loading}
                  className="rounded bg-zinc-900 px-3 py-1 text-xs text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Reactivar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PortalBajaForm({
  token,
  clientId,
  onSuccess,
}: {
  token: string;
  clientId: string;
  onSuccess: () => void;
}) {
  const [employees, setEmployees] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch(`/api/portal/${token}/employees?status=activo`)
      .then((r) => r.json())
      .then((d) => setEmployees(Array.isArray(d) ? d : []))
      .catch(() => setEmployees([]));
  }, [clientId, token]);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold dark:text-zinc-100">Baja</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!employeeId) return;
          setLoading(true);
          try {
            const res = await fetch(`/api/portal/${token}/baja`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ clientId, employeeId, notes }),
            });
            if (res.ok) onSuccess();
          } finally {
            setLoading(false);
          }
        }}
        className="space-y-3"
      >
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Empleado *</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">Seleccionar</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Observaciones</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
        </div>
        <button disabled={loading} type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">Enviar</button>
      </form>
    </div>
  );
}

function PortalIncapacidadForm({
  token,
  clientId,
  onSuccess,
}: {
  token: string;
  clientId: string;
  onSuccess: () => void;
}) {
  const [employees, setEmployees] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch(`/api/portal/${token}/employees?status=activo`)
      .then((r) => r.json())
      .then((d) => setEmployees(Array.isArray(d) ? d : []))
      .catch(() => setEmployees([]));
  }, [clientId, token]);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold dark:text-zinc-100">Incapacidad</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!employeeId) return;
          setLoading(true);
          try {
            const res = await fetch(`/api/portal/${token}/incapacidad`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                clientId,
                employeeId,
                startDate,
                endDate,
                notes,
              }),
            });
            if (res.ok) onSuccess();
          } finally {
            setLoading(false);
          }
        }}
        className="space-y-3"
      >
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Empleado *</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">Seleccionar</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Desde</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Hasta</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Observaciones</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
        </div>
        <button disabled={loading} type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">Enviar</button>
      </form>
    </div>
  );
}

function PortalVacacionesForm({
  token,
  clientId,
  onSuccess,
}: {
  token: string;
  clientId: string;
  onSuccess: () => void;
}) {
  const [employees, setEmployees] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch(`/api/portal/${token}/employees?status=activo`)
      .then((r) => r.json())
      .then((d) => setEmployees(Array.isArray(d) ? d : []))
      .catch(() => setEmployees([]));
  }, [clientId, token]);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold dark:text-zinc-100">Vacaciones</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!employeeId) return;
          setLoading(true);
          try {
            const res = await fetch(`/api/portal/${token}/vacaciones`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                clientId,
                employeeId,
                startDate,
                endDate,
                notes,
              }),
            });
            if (res.ok) onSuccess();
          } finally {
            setLoading(false);
          }
        }}
        className="space-y-3"
      >
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Empleado *</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">Seleccionar</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Desde</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Hasta</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300">Observaciones</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
        </div>
        <button disabled={loading} type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">Enviar</button>
      </form>
    </div>
  );
}
