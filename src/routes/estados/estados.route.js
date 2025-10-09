import express from 'express';
import { getEstados } from '../../controllers/estados.controller.js';

const router = express.Router();

router.get('/', getEstados);

export default router;
