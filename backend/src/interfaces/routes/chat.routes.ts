import { Router } from "express";
import { ConversationRepository } from "../../infrastructure/database/repositories/conversationRepository";
import { MessageRepository } from "../../infrastructure/database/repositories/messageRepository";
import { SendChatMessageUseCase } from "../../application/use-cases/sendChatMessageUseCase";
import { ChatController } from "../controllers/chat.controller";
import { RedisCacheService } from "../../infrastructure/external/cache/redisCacheService";
import { OpenRouterLLMService } from "../../infrastructure/external/services/OpenRouterLLMService";

const router = Router();

const conversationRepository = new ConversationRepository()
const messageRepository=new MessageRepository()
const llmService = new OpenRouterLLMService()
const redisCacheService = new RedisCacheService()

const sendChatMessageUseCase=new SendChatMessageUseCase(messageRepository,conversationRepository,llmService,redisCacheService)

const chatController = new ChatController(sendChatMessageUseCase,messageRepository)

router.post('/chat/message',(req,res,next)=>chatController.sendMessage(req,res,next))
router.get('/chat/history/:sessionId',(req,res,next)=>chatController.getHistory(req,res,next))

export default router;
