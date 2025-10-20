import mqtt from "mqtt";

// Configuración del broker
const MQTT_BROKER = "mqtt://localhost:1883";
const MQTT_OPTIONS = {
    clientId: "backend_server_" + Math.random().toString(16).substr(2, 8),
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
};

// Conectarse al broker
const client = mqtt.connect(MQTT_BROKER, MQTT_OPTIONS);

// EVENTOS
client.on("connect", () => {
    console.log("✅ Conectado al broker MQTT");

    // Suscribirse a tópicos relevantes
    const topics = ["robot/status", "test/topic"];
    client.subscribe(topics, (err) => {
        if (!err) console.log("📩 Suscrito a tópicos:", topics);
        else console.error("❌ Error al suscribirse:", err.message);
    });

    // Publicar mensaje inicial
    client.publish("backend/init", "Backend conectado y listo ✅");
});

// Manejar mensajes recibidos
client.on("message", (topic, message) => {
    const msg = message.toString();
    console.log(`📨 [${topic}] ${msg}`);

    // Ejemplo: si el robot manda estado
    if (topic === "robot/status") {
        console.log("🤖 Estado del robot:", msg);
        // Aquí podrías guardar el estado en base de datos o emitirlo a frontend
    }
});

// ⚠️ Manejar errores
client.on("error", (err) => {
    console.error("⚠️ Error en conexión MQTT:", err.message);
});

// FUNCIONES EXPORTADAS

// Publicar comando al robot
export const publishToRobot = (message) => {
    client.publish("robot/commands", message);
    console.log("📤 Enviado al robot:", message);
};

// Publicar mensaje genérico
export const publishMessage = (topic, message) => {
    client.publish(topic, message);
    console.log(`📤 Publicado en ${topic}: ${message}`);
};

// Suscribirse dinámicamente a un tópico
export const subscribeToTopic = (topic) => {
    client.subscribe(topic, (err) => {
        if (!err) console.log(`📩 Suscrito a ${topic}`);
        else console.error(`❌ Error al suscribirse a ${topic}:`, err.message);
    });
};

// Exportar el cliente por si querés usarlo directamente
export default client;