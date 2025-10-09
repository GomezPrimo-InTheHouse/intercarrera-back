import express from 'express';
import estadosRoutes from './estados/estados.route.js';
// import sensoresRoutes from './sensores/index.js';
// import ruedasRoutes from './ruedas/index.js';
// import notificacionesRoutes from './notificaciones/index.js';

const router = express.Router();

// 👉 Monta cada subruta con su prefijo correspondiente
router.use('/estados', estadosRoutes);
// router.use('/sensores', sensoresRoutes);
// router.use('/ruedas', ruedasRoutes);
// router.use('/notificaciones', notificacionesRoutes);

export default router;
