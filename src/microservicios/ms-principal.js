import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from '../routes/index.js';
import morgan from 'morgan';

import { pool } from '../conection/supabase.js';

dotenv.config();

const app = express();

app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

// ✅ Prefijo común para toda la API
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 4000;

// 🔥 Forzar una conexión al iniciar
(async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión inicial a la base exitosa');
  } catch (error) {
    console.error('❌ Error de conexión inicial a la base:', error.message);
  }
})();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});