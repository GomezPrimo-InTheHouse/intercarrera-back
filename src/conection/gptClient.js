// src/connection/gptClient.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// sendChat: recibe un array de mensajes (roles: system/user/assistant) y devuelve el texto de la respuesta
export async function sendChat(messages, model = process.env.OPENAI_NLU_MODEL || "gpt-4o-mini", opts = {}) {
  // opts puede incluir temperature, max_tokens, etc.
  try {
    const res = await client.chat.completions.create({
      model,
      messages,
      temperature: opts.temperature ?? 0.2,
      max_tokens: opts.max_tokens ?? 800,
    });

    const content = res.choices?.[0]?.message?.content ?? null;
    return { success: true, content, raw: res };
  } catch (error) {
    // levantar el error para que el controller lo maneje
    return { success: false, error };
  }
}

/**
 * testGPTConnection
 * Realiza una consulta mínima al modelo para verificar que la API key y la conexión estén correctas.
 */
export async function testGPTConnection() {
  try {
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_NLU_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 5,
    });

    if (res && res.choices && res.choices.length > 0) {
      console.log("✅ Conexión inicial con ChatGPT exitosa");
    } else {
      console.warn("⚠️ Respuesta inesperada de ChatGPT:", res);
    }
  } catch (error) {
    console.error("❌ Error de conexión inicial con ChatGPT:", error.message);
  }
}
