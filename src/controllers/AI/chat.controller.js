import { sendChat } from "../../conection/gptClient.js";



/**
 * POST /ai/chat.controller.js
 * Body: { prompt?: string, messages?: Array<{role,content}>, jsonSchema?: boolean }
 *
 * Si jsonSchema=true, se fuerza al modelo a responder SOLO con JSON para facilitar parseo.
 */
export async function postChat(req, res, next) {
  try {
    const { prompt, messages, jsonSchema } = req.body;

    if (!prompt && !messages) {
      return res.status(400).json({ error: "Se requiere 'prompt' o 'messages' en el body" });
    }

    // Construir mensajes si se envió solo prompt
    const msgs = messages ?? [
      {
        role: "system",
        content: jsonSchema
          ? "Actúa como un parser que convierte comandos de usuario en un JSON. Responde SOLO con un JSON válido."
          : "Eres un asistente útil.",
      },
      { role: "user", content: prompt ?? "" },
    ];

    // Si pedimos JSON estructurado, agregamos instrucciones claras
    if (jsonSchema && !messages) {
      // ejemplo de esquema para comandos de reproducción
      msgs.push({
        role: "system",
        content:
          'Devuelve SOLO un JSON válido con las keys: action, type, query, artist, album, confidence. ' +
          'Ejemplo: {"action":"play","type":"track","query":"Bohemian Rhapsody","artist":"Queen","album":null,"confidence":0.95}',
      });
    }

    const result = await sendChat(msgs);

    if (!result.success) throw result.error;

    const reply = result.content;

    // Si esperamos JSON, intentamos parsearlo
    if (jsonSchema) {
      try {
        // intentar parse directo o extraer la primera estructura JSON
        const parsed = tryParseJSON(reply);
        return res.json({ success: true, reply, parsed });
      } catch (parseErr) {
        return res.status(500).json({ success: false, error: "No se pudo parsear JSON del modelo", reply });
      }
    }

    return res.json({ success: true, reply });
  } catch (err) {
    next(err);
  }
}

// helper: intenta parsear JSON aun si el modelo devuelte texto extra
function tryParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    // buscar primer bloque JSON entre llaves
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw e;
    return JSON.parse(match[0]);
  }
}
