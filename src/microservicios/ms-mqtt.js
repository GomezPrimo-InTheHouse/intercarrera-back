// aca declaramos el microservicio, importamos la ruta despues de indexMqtt.js
// src/microservices/ms-mqtt.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import client from "../conection/mqttClient.js";
import routes from "../routes/indexMqtt.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", routes);

// Log de conexión MQTT
client.on("connect", () => {
    console.log("✅ [MS-MQTT] Conectado al broker MQTT");
});
client.on("error", (err) => {
    console.error("❌ [MS-MQTT] Error en MQTT:", err.message);
});

// Iniciar servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🚀 Microservicio MQTT corriendo en puerto ${PORT}`);
});
