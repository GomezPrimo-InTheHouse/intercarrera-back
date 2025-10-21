// aca declaramos las rutas vinculadas a los controladores ( en carpeta controllers / robot)
// src/routes/mqtt/mqttRoutes.js
import express from "express";
import { sendCommand, subscribeRobotTopic, sendTitle } from "../../controllers/robot/robotController.js";

const router = express.Router();

// Rutas específicas del robot vía MQTT
router.post("/command", sendCommand);
router.post("/title", sendTitle);

router.post("/subscribe", subscribeRobotTopic);

export default router;
