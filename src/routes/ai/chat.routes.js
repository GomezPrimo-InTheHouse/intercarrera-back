// src/routes/ai/chat.routes.js
import express from "express";
import { postChat } from "../../controllers/AI/chat.controller.js";

export default () => {
  const router = express.Router();
  router.post("/chat", postChat); // POST /ai/chat
  return router;
};
