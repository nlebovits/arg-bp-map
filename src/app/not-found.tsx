import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="es">
      <body className="h-screen w-screen flex items-center justify-center bg-[#14191F] text-[#F6F5F4]">
        <div className="text-center space-y-6 px-6">
          <h1 className="font-sans text-6xl font-bold tracking-tight">404</h1>
          <p className="text-xl text-[#ACADAF]">
            Página no encontrada / Page not found
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/es"
              className="px-6 py-3 bg-[#2126F7] text-white font-mono text-xs uppercase tracking-[0.1em] font-bold hover:bg-[#1B1FD4] transition-colors"
            >
              Ir al inicio (ES)
            </Link>
            <Link
              href="/en"
              className="px-6 py-3 border border-[#2A303A] text-[#F6F5F4] font-mono text-xs uppercase tracking-[0.1em] font-bold hover:bg-[#1C2128] transition-colors"
            >
              Go home (EN)
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
