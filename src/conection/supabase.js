import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

// ✅ Detecta automáticamente si usas DATABASE_URL o variables separadas
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 10, // máximo de conexiones simultáneas
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        ssl: { rejectUnauthorized: false },
        max: 10,
      }
);

// 🧠 Mensaje al conectar
pool.on("connect", () => {
  console.log("✅ Conectado correctamente a Supabase (Postgres)");
});

// ⚠️ Captura errores globales de conexión
pool.on("error", (err) => {
  console.error("❌ Error en la conexión con Supabase:", err.message);
});

export default pool;
