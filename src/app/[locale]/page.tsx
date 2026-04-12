import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Sidebar } from "@/components/Sidebar";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 bg-zinc-100 dark:bg-zinc-900">
        {/* Map would go here */}
        <div className="flex items-center justify-center h-full text-zinc-500">
          <MapPlaceholder />
        </div>
      </main>
    </div>
  );
}

function MapPlaceholder() {
  const t = useTranslations("common");
  return (
    <div className="text-center">
      <div className="text-6xl mb-4">🗺️</div>
      <p className="text-lg">{t("loading")}</p>
    </div>
  );
}
