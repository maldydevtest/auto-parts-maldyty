import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(5).max(120),
  car: z.string().trim().min(2).max(150),
  parts: z.string().trim().min(3).max(1000),
  language: z.enum(["pl", "en"]),
  captchaA: z.number().int().min(1).max(9),
  captchaB: z.number().int().min(1).max(9),
  captchaAnswer: z.number().int().min(0).max(9999),
});

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const sendEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    if (data.captchaAnswer !== data.captchaA + data.captchaB) {
      return { ok: false as const, reason: "captcha_failed" as const };
    }
    const botToken = process.env["TELEGRAM_BOT_TOKEN"];
    const chatId = process.env["TELEGRAM_CHAT_ID"];
    if (!botToken || !chatId) {
      return { ok: false as const, reason: "not_configured" as const };
    }
    const labels = data.language === "pl"
      ? { title: "Nowe zapytanie o części", name: "Imię", contact: "Kontakt", car: "Auto", parts: "Części" }
      : { title: "New parts enquiry", name: "Name", contact: "Contact", car: "Car", parts: "Parts" };
    const message = [
      `🚗 <b>${labels.title}</b>`,
      ``,
      `<b>${labels.name}:</b> ${escapeHtml(data.name)}`,
      `<b>${labels.contact}:</b> ${escapeHtml(data.contact)}`,
      `<b>${labels.car}:</b> ${escapeHtml(data.car)}`,
      `<b>${labels.parts}:</b> ${escapeHtml(data.parts)}`,
    ].join("\n");
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });
    const body = await response.text();
    async function log(status: "success" | "failure", detail: string | null) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("telegram_delivery_log").insert({ chat_id: chatId!, status, detail });
      } catch (error) {
        console.error("Delivery log write failed", error);
      }
    }
    if (!response.ok) {
      console.error(`Telegram request failed [${response.status}]: ${body}`);
      await log("failure", `HTTP ${response.status}: ${body.slice(0, 300)}`);
      return { ok: false as const, reason: "delivery_failed" as const };
    }
    await log("success", null);
    return { ok: true as const };
  });
