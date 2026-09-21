import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, RefreshCw, Send, ShieldCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendEnquiry } from "@/lib/enquiry.functions";
import { useLanguage } from "@/lib/i18n";

function newChallenge() {
  return { a: 1 + Math.floor(Math.random() * 9), b: 1 + Math.floor(Math.random() * 9) };
}

export function EnquiryForm() {
  const { language } = useLanguage();
  const send = useServerFn(sendEnquiry);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "unavailable" | "captcha">("idle");
  const [challenge, setChallenge] = useState<{ a: number; b: number } | null>(null);
  useEffect(() => { setChallenge(newChallenge()); }, []);
  const copy = language === "pl" ? {
    tag: "Zapytanie o części", title: "Napisz, czego szukasz", body: "Podaj dane auta i potrzebną część. Wiadomość trafi bezpośrednio do sklepu.", name: "Imię i nazwisko", contact: "Telefon lub e-mail", car: "Marka, model, rocznik lub VIN", parts: "Potrzebne części", captcha: "Potwierdź, że nie jesteś robotem", captchaHint: "Wpisz wynik dodawania", send: "Wyślij zapytanie", sending: "Wysyłanie…", sent: "Dziękujemy. Zapytanie zostało wysłane.", captchaError: "Nieprawidłowy wynik. Spróbuj ponownie.", unavailable: "Nie udało się wysłać wiadomości. Zadzwoń: 665 836 113."
  } : {
    tag: "Parts enquiry", title: "Tell us what you need", body: "Add your car details and the part you need. Your message goes directly to the store.", name: "Your name", contact: "Phone or email", car: "Make, model, year or VIN", parts: "Parts needed", captcha: "Confirm you are not a robot", captchaHint: "Enter the sum", send: "Send enquiry", sending: "Sending…", sent: "Thank you. Your enquiry has been sent.", captchaError: "Incorrect answer. Please try again.", unavailable: "The message could not be sent. Please call 665 836 113."
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending");
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    try {
      const result = await send({ data: {
        name: String(form.get("name") ?? ""), contact: String(form.get("contact") ?? ""),
        car: String(form.get("car") ?? ""), parts: String(form.get("parts") ?? ""), language,
        captchaA: challenge.a, captchaB: challenge.b, captchaAnswer: Number(form.get("captcha") ?? -1),
      } });
      if (result.ok) { setStatus("sent"); formEl.reset(); }
      else setStatus(result.reason === "captcha_failed" ? "captcha" : "unavailable");
    } catch { setStatus("unavailable"); }
    setChallenge(newChallenge());
  }
  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="glass-panel grid gap-8 p-6 sm:p-10 lg:grid-cols-2"><div><p className="label text-accent-strong">{copy.tag}</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{copy.title}</h2><p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{copy.body}</p><div className="mt-7 flex items-center gap-3 rounded-xl border border-glass bg-glass p-4"><span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><Send className="size-5" /></span><div><p className="text-sm font-bold">Telegram</p><p className="text-xs text-muted-foreground">{language === "pl" ? "Bezpośrednio do obsługi sklepu" : "Directly to the store team"}</p></div></div></div><form className="space-y-4" onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2"><Field name="name" label={copy.name} /><Field name="contact" label={copy.contact} /></div><Field name="car" label={copy.car} /><label className="block"><span className="field-label">{copy.parts}</span><textarea name="parts" required rows={4} className="field mt-2 resize-none" /></label><div className="rounded-xl border border-glass bg-glass p-4"><span className="field-label flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />{copy.captcha}</span><div className="mt-3 flex items-center gap-3"><span className="grid h-11 shrink-0 place-items-center rounded-lg bg-card px-4 font-display text-base font-bold tabular-nums">{challenge.a} + {challenge.b} = ?</span><input name="captcha" required inputMode="numeric" pattern="[0-9]*" autoComplete="off" placeholder={copy.captchaHint} className="field" /><button type="button" aria-label="New challenge" onClick={() => setChallenge(newChallenge())} className="grid size-11 shrink-0 place-items-center rounded-lg border border-glass bg-card text-muted-foreground transition hover:text-primary"><RefreshCw className="size-4" /></button></div></div><Button type="submit" variant="brand" size="xl" className="w-full" disabled={status === "sending"}>{status === "sending" ? copy.sending : copy.send}<Send /></Button>{status === "sent" && <p className="status-success"><CheckCircle2 />{copy.sent}</p>}{status === "captcha" && <p className="status-warning"><TriangleAlert />{copy.captchaError}</p>}{status === "unavailable" && <p className="status-warning"><TriangleAlert />{copy.unavailable}</p>}</form></div></section>;
}
function Field({ name, label }: { name: string; label: string }) { return <label className="block"><span className="field-label">{label}</span><input name={name} required className="field mt-2" /></label>; }
