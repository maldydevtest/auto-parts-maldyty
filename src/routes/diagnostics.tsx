import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Eye, EyeOff, Lock, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/site-shell";
import { runDiagnostics } from "@/lib/diagnostics.functions";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/diagnostics")({
  head: () => ({
    meta: [
      { title: "Diagnostyka Telegram — Auto Parts Store in Maldyty" },
      { name: "description", content: "Prywatna strona właściciela: status bota Telegram, chat ID i ostatnia dostarczona wiadomość." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Diagnostyka Telegram — Auto Parts Store in Maldyty" },
      { property: "og:description", content: "Prywatna strona diagnostyczna sklepu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DiagnosticsPage,
});

type Report = Extract<Awaited<ReturnType<typeof runDiagnostics>>, { ok: true }>;

function DiagnosticsPage() {
  const { language } = useLanguage();
  const check = useServerFn(runDiagnostics);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "denied" | "error" | "ready">("idle");
  const [report, setReport] = useState<Report | null>(null);
  const [showChatId, setShowChatId] = useState(false);

  const copy = language === "pl"
    ? {
        eyebrow: "Tylko dla właściciela", title: "Diagnostyka Telegram",
        intro: "Sprawdź, czy bot działa, czy chat ID jest poprawny i kiedy ostatnia wiadomość dotarła. Token nigdy nie jest pokazywany.",
        codeLabel: "Kod dostępu", open: "Sprawdź", loading: "Sprawdzanie…", refresh: "Odśwież",
        denied: "Nieprawidłowy kod dostępu.", error: "Nie udało się wykonać sprawdzenia. Spróbuj ponownie.",
        token: "Token bota", tokenOk: "Zapisany i ukryty", tokenMissing: "Brak tokenu",
        bot: "Dostępność bota", botOk: "Bot odpowiada", botBad: "Bot nie odpowiada",
        chat: "Chat ID", chatOk: "Czat dostępny dla bota", chatBad: "Czat niedostępny",
        show: "Pokaż", hide: "Ukryj",
        last: "Ostatnia udana dostawa", none: "Jeszcze brak udanych dostaw",
        lastFail: "Ostatni błąd dostawy", noFail: "Brak zarejestrowanych błędów",
        checked: "Sprawdzono",
      }
    : {
        eyebrow: "Owner only", title: "Telegram diagnostics",
        intro: "Check that the bot works, the chat ID is correct, and when the last message was delivered. The token is never displayed.",
        codeLabel: "Access code", open: "Check", loading: "Checking…", refresh: "Refresh",
        denied: "Incorrect access code.", error: "The check could not be completed. Please try again.",
        token: "Bot token", tokenOk: "Saved and hidden", tokenMissing: "Token missing",
        bot: "Bot availability", botOk: "Bot responds", botBad: "Bot not responding",
        chat: "Chat ID", chatOk: "Chat reachable by the bot", chatBad: "Chat not reachable",
        show: "Show", hide: "Hide",
        last: "Last successful delivery", none: "No successful deliveries yet",
        lastFail: "Last delivery error", noFail: "No errors recorded",
        checked: "Checked at",
      };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const result = await check({ data: { code } });
      if (result.ok) { setReport(result); setStatus("ready"); }
      else { setReport(null); setStatus("denied"); }
    } catch {
      setStatus("error");
    }
  }

  const fmt = (value: string | null) =>
    value ? new Date(value).toLocaleString(language === "pl" ? "pl-PL" : "en-GB") : null;

  return (
    <>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.intro} />
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <form onSubmit={submit} className="glass-panel space-y-4 p-6 sm:p-8">
          <label className="block">
            <span className="field-label flex items-center gap-2"><Lock className="size-4 text-primary" />{copy.codeLabel}</span>
            <input type="password" autoComplete="current-password" required value={code} onChange={(e) => setCode(e.target.value)} className="field mt-2" />
          </label>
          <Button type="submit" variant="brand" size="xl" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? copy.loading : status === "ready" ? copy.refresh : copy.open}
            <RefreshCw />
          </Button>
          {status === "denied" && <p className="status-warning"><TriangleAlert />{copy.denied}</p>}
          {status === "error" && <p className="status-warning"><TriangleAlert />{copy.error}</p>}
        </form>

        {status === "ready" && report && (
          <div className="mt-6 space-y-3">
            <Row label={copy.token} ok={report.tokenConfigured} value={report.tokenConfigured ? copy.tokenOk : copy.tokenMissing} />
            <Row
              label={copy.bot}
              ok={report.bot.reachable}
              value={report.bot.reachable ? `${copy.botOk}${report.bot.username ? ` · @${report.bot.username}` : ""}` : `${copy.botBad}${report.bot.detail ? ` · ${report.bot.detail}` : ""}`}
            />
            <Row
              label={copy.chat}
              ok={report.chatReachable.ok}
              value={`${showChatId ? (report.chatIdFull ?? "—") : (report.chatIdMasked ?? "—")} · ${report.chatReachable.ok ? copy.chatOk : `${copy.chatBad}${report.chatReachable.detail ? ` (${report.chatReachable.detail})` : ""}`}`}
              action={
                <button type="button" onClick={() => setShowChatId((v) => !v)} className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition hover:text-primary">
                  {showChatId ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  {showChatId ? copy.hide : copy.show}
                </button>
              }
            />
            <Row label={copy.last} ok={Boolean(report.lastSuccessAt)} value={fmt(report.lastSuccessAt) ?? copy.none} />
            <Row
              label={copy.lastFail}
              ok={!report.lastFailureAt}
              value={report.lastFailureAt ? `${fmt(report.lastFailureAt)}${report.lastFailureDetail ? ` · ${report.lastFailureDetail}` : ""}` : copy.noFail}
            />
            <p className="px-1 text-xs text-muted-foreground">{copy.checked}: {fmt(report.checkedAt)}</p>
          </div>
        )}
      </section>
    </>
  );
}

function Row({ label, ok, value, action }: { label: string; ok: boolean; value: string; action?: React.ReactNode }) {
  return (
    <div className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
      <div className="min-w-0">
        <p className="label">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold">{value}</p>
      </div>
      <div className="flex items-center gap-3">
        {action}
        <span className={ok ? "status-success" : "status-warning"}>{ok ? <CheckCircle2 /> : <TriangleAlert />}</span>
      </div>
    </div>
  );
}
