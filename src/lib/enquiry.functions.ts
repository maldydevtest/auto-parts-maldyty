import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(5).max(120),
  car: z.string().trim().min(2).max(150),
  parts: z.string().trim().min(3).max(1000),
  language: z.enum(["pl", "en"]),
});

export const sendEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    const lovableApiKey = process.env["LOVABLE_API_KEY"];
    const telegramApiKey = process.env["TELEGRAM_API_KEY"];
    const chatId = process.env["TELEGRAM_CHAT_ID"];
    if (!lovableApiKey || !telegramApiKey || !chatId) {
      return { ok: false as const, reason: "not_configured" as const };
    }
    const message = [`🚗 New parts enquiry`, `Name: ${data.name}`, `Contact: ${data.contact}`, `Car: ${data.car}`, `Parts: ${data.parts}`, `Language: ${data.language.toUpperCase()}`].join("\n");
    const response = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableApiKey}`, "X-Connection-Api-Key": telegramApiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
    const body = await response.text();
    if (!response.ok) {
      console.error(`Telegram request failed [${response.status}]: ${body}`);
      return { ok: false as const, reason: "delivery_failed" as const };
    }
    return { ok: true as const };
  });
