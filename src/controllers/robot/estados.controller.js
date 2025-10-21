import pool  from '../../conection/supabase.js';


// Obtener todos los estados
export const getEstados = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM estados');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener estados:', error);
    res.status(500).json({ error: 'Error al obtener estados' });
  }
};

