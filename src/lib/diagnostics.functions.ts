import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const accessSchema = z.object({ code: z.string().trim().min(1).max(200) });

function maskChatId(chatId: string): string {
  if (chatId.length <= 4) return chatId;
  return `${chatId.slice(0, 3)}${"•".repeat(Math.max(chatId.length - 6, 1))}${chatId.slice(-3)}`;
}

export const runDiagnostics = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => accessSchema.parse(input))
  .handler(async ({ data }) => {
    const accessCode = process.env["DIAGNOSTICS_ACCESS_CODE"];
    if (!accessCode || data.code !== accessCode) {
      return { ok: false as const, reason: "unauthorized" as const };
    }

    const botToken = process.env["TELEGRAM_BOT_TOKEN"];
    const chatId = process.env["TELEGRAM_CHAT_ID"];

    let bot: { reachable: boolean; username: string | null; detail: string | null } = {
      reachable: false,
      username: null,
      detail: botToken ? null : "Bot token is not configured",
    };
    let chatReachable: { ok: boolean; detail: string | null } = { ok: false, detail: null };

    if (botToken) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
        const body = (await res.json()) as { ok?: boolean; result?: { username?: string }; description?: string };
        bot = {
          reachable: Boolean(body.ok),
          username: body.result?.username ?? null,
          detail: body.ok ? null : (body.description ?? `HTTP ${res.status}`),
        };
      } catch (error) {
        bot = { reachable: false, username: null, detail: error instanceof Error ? error.message : "Network error" };
      }

      if (chatId) {
        try {
          const res = await fetch(`https://api.telegram.org/bot${botToken}/getChat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId }),
          });
          const body = (await res.json()) as { ok?: boolean; description?: string };
          chatReachable = { ok: Boolean(body.ok), detail: body.ok ? null : (body.description ?? `HTTP ${res.status}`) };
        } catch (error) {
          chatReachable = { ok: false, detail: error instanceof Error ? error.message : "Network error" };
        }
      } else {
        chatReachable = { ok: false, detail: "Chat ID is not configured" };
      }
    }

    let lastSuccessAt: string | null = null;
    let lastFailureAt: string | null = null;
    let lastFailureDetail: string | null = null;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: success } = await supabaseAdmin
        .from("telegram_delivery_log")
        .select("created_at")
        .eq("status", "success")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      lastSuccessAt = success?.created_at ?? null;
      const { data: failure } = await supabaseAdmin
        .from("telegram_delivery_log")
        .select("created_at, detail")
        .eq("status", "failure")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      lastFailureAt = failure?.created_at ?? null;
      lastFailureDetail = failure?.detail ?? null;
    } catch (error) {
      console.error("Diagnostics log read failed", error);
    }

    return {
      ok: true as const,
      chatIdConfigured: Boolean(chatId),
      chatIdMasked: chatId ? maskChatId(chatId) : null,
      chatIdFull: chatId ?? null,
      tokenConfigured: Boolean(botToken),
      bot,
      chatReachable,
      lastSuccessAt,
      lastFailureAt,
      lastFailureDetail,
      checkedAt: new Date().toISOString(),
    };
  });
