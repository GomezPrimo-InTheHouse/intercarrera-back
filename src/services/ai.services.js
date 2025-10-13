// src/services/ai.service.js
import { sendChat } from "../conection/gptClient.js";

export async function interpretarOrdenConGPT(prompt) {
  const messages = [
    {
      role: "system",
      content: "Actúa como un parser de comandos de música para Spotify. " +
        "Respondé solo un JSON con las claves: action, type, query, artist, album, confidence. " +
        "Ejemplo: {\"action\":\"play\",\"type\":\"track\",\"query\":\"Bohemian Rhapsody\",\"artist\":\"Queen\",\"album\":null,\"confidence\":0.98}",
    },
    {
      role: "user",
      content: prompt
    }
  ];

  const result = await sendChat(messages);
  if (!result.success) throw result.error;

  try {
    const content = result.content;
    const json = tryParseJSON(content);
    return json;
  } catch (err) {
    throw new Error("No se pudo interpretar la respuesta de GPT como JSON");
  }
}

function tryParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw e;
    return JSON.parse(match[0]);
  }
}
