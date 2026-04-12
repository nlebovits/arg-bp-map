"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function Sidebar() {
  const t = useTranslations("sidebar");
  const tLang = useTranslations("language");

  return (
    <aside className="w-72 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {t("title")}
          </h1>
          <LanguageToggle />
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t("search.label")}
        </label>
        <input
          type="text"
          placeholder={t("search.placeholder")}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          {t("filters.header")}
        </h2>
        <div className="space-y-2">
          <label className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("filters.categories")}
          </label>
          <div className="flex gap-2">
            <button className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
              {t("filters.showAll")}
            </button>
            <button className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded">
              {t("filters.hideAll")}
            </button>
          </div>
        </div>
      </div>

      {/* Layers */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          {t("layers.header")}
        </h2>
        <div className="space-y-2">
          {(["satellite", "streets", "terrain"] as const).map((layer) => (
            <label key={layer} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="radio"
                name="layer"
                defaultChecked={layer === "streets"}
                className="text-blue-600"
              />
              {t(`layers.${layer}`)}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 mt-auto">
        <div className="grid grid-cols-2 gap-2">
          {(["zoomIn", "zoomOut", "resetView", "myLocation"] as const).map((action) => (
            <button
              key={action}
              className="px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
            >
              {t(`actions.${action}`)}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const tLang = useTranslations("language");

  const toggleLocale = () => {
    const newLocale: Locale = locale === "es" ? "en" : "es";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
      title={tLang("toggle")}
    >
      <span className="text-base">{locale === "es" ? "🇪🇸" : "🇬🇧"}</span>
      <span className="uppercase font-medium">{locale}</span>
    </button>
  );
}
