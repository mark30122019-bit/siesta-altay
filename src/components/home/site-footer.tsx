import { GLOBAL_CONFIG } from "@/config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200/80 py-10 text-center">
      <p className="font-sans text-sm text-stone-400">
        {GLOBAL_CONFIG.companyName.replace(" Центр", "")} © {year}
      </p>
    </footer>
  );
}
