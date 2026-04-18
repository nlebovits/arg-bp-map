import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="es">
      <body className="h-screen w-screen flex items-center justify-center bg-[#0a0a0f] text-[#fafafa]">
        <div className="text-center space-y-6 px-6">
          <h1 className="text-6xl font-semibold">404</h1>
          <p className="text-xl text-[#a1a1aa]">
            Página no encontrada / Page not found
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/es"
              className="px-6 py-3 bg-[#f59e0b] text-[#0a0a0f] rounded-lg font-medium hover:bg-[#fbbf24] transition-colors"
            >
              Ir al inicio (ES)
            </Link>
            <Link
              href="/en"
              className="px-6 py-3 border border-[#27272a] text-[#fafafa] rounded-lg font-medium hover:bg-[#18181b] transition-colors"
            >
              Go home (EN)
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
