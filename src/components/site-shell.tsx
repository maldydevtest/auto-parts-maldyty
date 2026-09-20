import { Link } from "@tanstack/react-router";
import { Clock3, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const nav = [
  ["/", "Strona główna", "Home"],
  ["/about", "O nas", "About us"],
  ["/location", "Jak nas znaleźć", "Find us"],
  ["/gallery", "Zdjęcia i wideo", "Photos & video"],
  ["/products", "Towary", "Products"],
] as const;

export function Header() {
  const { language, setLanguage } = useLanguage();
  return (
    <header className="relative z-30 mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="glass-shell px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Auto Parts Store in Maldyty">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-brand">
              <ShoppingBag className="size-5" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-sm font-bold sm:text-[15px]">Auto Parts Store in Maldyty</span>
              <span className="block text-[11px] font-medium text-muted-foreground">Części samochodowe · Auto parts</span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex rounded-full border border-glass bg-glass p-1">
              <Button type="button" size="sm" variant={language === "pl" ? "languageActive" : "language"} onClick={() => setLanguage("pl")}>PL</Button>
              <Button type="button" size="sm" variant={language === "en" ? "languageActive" : "language"} onClick={() => setLanguage("en")}>EN</Button>
            </div>
            <Button asChild variant="brand" className="hidden sm:inline-flex">
              <a href="tel:+48665836113"><Phone /> {language === "pl" ? "Zadzwoń" : "Call"}</a>
            </Button>
          </div>
        </div>
        <nav className="scrollbar-none mt-3 flex gap-1 overflow-x-auto border-t border-glass pt-3 lg:mt-0 lg:absolute lg:left-1/2 lg:top-1/2 lg:w-max lg:-translate-x-1/2 lg:-translate-y-1/2 lg:border-0 lg:pt-0" aria-label="Main navigation">
          {nav.map(([to, pl, en]) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }} className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-glass-strong hover:text-foreground" activeProps={{ className: "bg-glass-strong text-foreground" }}>
              {language === "pl" ? pl : en}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const { language } = useLanguage();
  return (
    <footer className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6">
      <div className="glass-shell grid gap-6 px-6 py-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display font-bold">Auto Parts Store in Maldyty</p>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">{language === "pl" ? "Lokalny sklep z częściami i akcesoriami samochodowymi w Małdytach." : "Your local car parts and accessories store in Małdyty."}</p>
        </div>
        <div className="text-sm">
          <p className="label">{language === "pl" ? "Kontakt" : "Contact"}</p>
          <a className="mt-2 flex items-center gap-2 hover:text-primary" href="tel:+48665836113"><Phone className="size-4" />665 836 113</a>
          <a className="mt-2 flex items-center gap-2 hover:text-primary" href="mailto:email@gmail.com">email@gmail.com</a>
        </div>
        <div className="text-sm">
          <p className="label">{language === "pl" ? "Sklep" : "Store"}</p>
          <p className="mt-2 flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" />ul. Prusa 5, 14-330 Małdyty</p>
          <p className="mt-2 flex items-start gap-2 text-muted-foreground"><Clock3 className="mt-0.5 size-4 shrink-0" />Pn–Pt 8:00–16:30 · Sob 7:30–13:30</p>
        </div>
      </div>
    </footer>
  );
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16"><p className="label text-primary">{eyebrow}</p><h1 className="mt-3 max-w-4xl font-display text-4xl font-bold leading-tight sm:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p></section>;
}
