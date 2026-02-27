export default function PublicHomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-semibold">Despacho Contable</h1>
      <p className="text-center text-zinc-600">
        Sistema interno de gestión para despachos contables.
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
        >
          Iniciar sesión
        </a>
        <a
          href="/registro"
          className="rounded-lg border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
        >
          Registrarse
        </a>
      </div>
    </div>
  );
}
