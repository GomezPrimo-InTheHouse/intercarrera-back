
import express from 'express'
import chatRoutes from "./ai/chat.routes.js";



const router = express.Router();

router.use("/ai", chatRoutes());



export default router;
