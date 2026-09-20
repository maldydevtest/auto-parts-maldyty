import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/enquiry-form";
import { useLanguage } from "@/lib/i18n";
import { categories } from "@/lib/catalog";
import storeInterior from "@/assets/store-interior.jpg";
import brakeParts from "@/assets/brake-parts.jpg";
import filtersShelf from "@/assets/filters-shelf.jpg";
import mechanicParts from "@/assets/mechanic-parts.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Auto Parts Store in Maldyty | Części samochodowe" },
    { name: "description", content: "Części samochodowe, oleje, filtry i akcesoria w Małdytach. ul. Prusa 5." },
    { property: "og:title", content: "Auto Parts Store in Maldyty" },
    { property: "og:description", content: "Lokalny sklep z częściami samochodowymi w Małdytach." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: HomePage,
});

function HomePage() {
  const { language } = useLanguage(); const pl = language === "pl";
  return <>
    <section className="reveal mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_.95fr]">
      <div><p className="label inline-flex items-center gap-2 rounded-full border border-glass bg-glass px-3 py-2 text-primary"><span className="size-2 rounded-full bg-accent" />Małdyty · ul. Prusa 5</p>
        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] sm:text-7xl">{pl ? "Części do Twojego auta," : "Parts for your car,"}<br/><span className="text-primary">{pl ? "wybierz i zamów" : "choose and order"}</span></h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">{pl ? "Pomagamy znaleźć właściwe części, oleje, filtry i akcesoria. Zapytaj o dostępność telefonicznie lub przez formularz." : "We help you find the right parts, oils, filters and accessories. Ask about availability by phone or through the form."}</p>
        <div className="mt-8 flex flex-wrap gap-3"><Button asChild variant="brand" size="xl"><Link to="/products">{pl ? "Przeglądaj towary" : "Browse products"}<ArrowRight /></Link></Button><Button asChild variant="glass" size="xl"><a href="#enquiry">{pl ? "Zadaj pytanie" : "Ask a question"}</a></Button></div>
        <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-muted-foreground"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-accent-strong" />{pl ? "Pomoc w doborze" : "Fitment help"}</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-accent-strong" />{pl ? "Odbiór w Małdytach" : "Pickup in Małdyty"}</span></div>
      </div>
      <div className="relative mx-auto w-full max-w-xl pb-6"><div className="glass-panel p-3"><img src={storeInterior} alt={pl ? "Wnętrze sklepu z częściami samochodowymi" : "Auto parts store interior"} width={1024} height={1024} className="aspect-[4/5] w-full rounded-2xl object-cover" /></div><div className="glass-shell absolute -bottom-1 left-2 max-w-[16rem] p-4 sm:-left-6"><p className="label text-primary">{pl ? "Jesteśmy na miejscu" : "Visit us"}</p><p className="mt-2 flex items-start gap-2 text-sm font-bold"><MapPin className="size-4 shrink-0 text-primary"/>ul. Prusa 5, 14-330 Małdyty</p></div></div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="flex items-end justify-between"><div><p className="label text-primary">{pl ? "Asortyment" : "Range"}</p><h2 className="mt-2 font-display text-3xl font-bold">{pl ? "Najczęściej wybierane kategorie" : "Popular product categories"}</h2></div><Link to="/products" className="hidden text-sm font-bold text-primary sm:block">{pl ? "Wszystkie towary" : "All products"} →</Link></div><div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{categories.slice(0,4).map((item, index) => <Link to="/products" key={item.pl} className="glass-shell p-5 transition hover:-translate-y-1 hover:bg-card"><item.icon className="size-8 text-primary"/><p className="mt-8 font-display text-base font-bold">{pl ? item.pl : item.en}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{pl ? item.plText : item.enText}</p><span className="mt-4 block text-xs font-bold text-primary">0{index+1}</span></Link>)}</div></section>
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="grid grid-cols-2 gap-4 md:grid-cols-3"><img loading="lazy" src={brakeParts} width={1024} height={768} alt={pl ? "Tarcze i klocki hamulcowe" : "Brake discs and pads"} className="aspect-[4/3] w-full rounded-2xl object-cover"/><img loading="lazy" src={filtersShelf} width={1024} height={768} alt={pl ? "Oleje i filtry na półkach" : "Oils and filters on shelves"} className="aspect-[4/3] w-full rounded-2xl object-cover"/><Link to="/gallery" className="relative col-span-2 overflow-hidden rounded-2xl md:col-span-1"><img loading="lazy" src={mechanicParts} width={1024} height={768} alt={pl ? "Części elektryczne" : "Electrical parts"} className="aspect-[4/3] w-full object-cover"/><span className="absolute inset-0 grid place-items-center bg-foreground/25 text-sm font-bold text-primary-foreground">{pl ? "Zobacz galerię" : "View gallery"} <ArrowRight className="ml-2 inline size-4"/></span></Link></div></section>
    <div id="enquiry"><EnquiryForm /></div>
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="glass-panel flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8"><div><p className="label text-primary">{pl ? "Kontakt" : "Contact"}</p><h2 className="mt-2 font-display text-2xl font-bold">{pl ? "Potrzebujesz części? Zadzwoń." : "Need a part? Give us a call."}</h2></div><div className="flex flex-wrap gap-3"><Button asChild variant="brand" size="xl"><a href="tel:+48665836113"><Phone/>665 836 113</a></Button><Button asChild variant="glass" size="xl"><Link to="/location"><MapPin/>{pl ? "Jak nas znaleźć" : "Find us"}</Link></Button></div></div></section>
  </>;
}
