import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiChatRoutes from '../routes/indexAi.js';
import morgan from 'morgan';
import { testGPTConnection } from "../conection/gptClient.js";

dotenv.config();

const app = express();

app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

// ✅ Prefijo común para toda la API
app.use('/apiChat', apiChatRoutes);

const PORT_MS_AI = process.env.PORT || 4002;

// 🔥 Forzar una conexión al iniciar
// Test de conexión al iniciar
(async () => {
  await testGPTConnection();
})();


app.listen(PORT_MS_AI, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT_MS_AI}`);
});