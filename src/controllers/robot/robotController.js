// src/controllers/robotController.js
import { publishToRobot, subscribeToTopic, publishMusic } from "../../conection/mqttClient.js";

export const sendCommand = (req, res) => {
    const { command } = req.body;
    if (!command) return res.status(400).json({ error: "Falta el comando" });

    publishToRobot(command);
    res.status(200).json({ message: `Comando enviado: ${command}` });
};

export const sendTitle = (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Falta el titulo" });

    publishMusic(title);
    res.status(200).json({ message: `Titulo enviado: ${title}` });
};

export const subscribeRobotTopic = (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Falta el tópico" });

    subscribeToTopic(topic);
    res.status(200).json({ message: `Suscrito a tópico: ${topic}` });
};

export const robotModel = {
    status: "desconocido",
    lastCommand: null,
};
