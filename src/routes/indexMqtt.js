// aca importamos el paquete de rutas declarado en mqtt.js
// tambien declaramos la conexion de mqttClient.js
// src/routes/indexMqtt.js
import express from "express";
import mqttRoutes from "./mqtt/mqttRoutes.js";

const router = express.Router();

// Prefijo /mqtt
router.use("/mqtt", mqttRoutes);

export default router;
