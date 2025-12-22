import { randomUUID } from "crypto";
import { Message } from "../../domain/entities/Message";
import { ISendChatMessageService } from "../../domain/interfaces/ISendChatMessageService";
import { SendChatMessageDTO } from "../../domain/dtos/sendChatMessage.dto";
import { IMessageRepository } from "../../domain/interfaces/IMessageRepository";
import { IConversationRepository } from "../../domain/interfaces/IConversationRepository";
import { AppError } from "../error/AppError";
import { ErrorCode } from "../error/ErrorCode";
import { HttpStatusCode } from "../../utils/httpStatusCode";
import { ILLMService } from "../../domain/interfaces/ILLMService";
import { STORE_FAQ } from "../constants/faq";
import { ICacheService } from "../../domain/interfaces/ICacheService";

export class SendChatMessageUseCase implements ISendChatMessageService {
    constructor(
        private readonly _messageRepository: IMessageRepository,
        private readonly _conversationRepository: IConversationRepository,
        private readonly _llmService: ILLMService,
        private readonly _cacheService: ICacheService
    ) { }

    async execute(input: SendChatMessageDTO): Promise<{ reply: string; sessionId: string; }> {
        const { message, sessionId } = input
        let MAX_MESSAGE_LENGTH = 500
        if (!message || !message.trim()) {
            throw new AppError(
                ErrorCode.VALIDATION_ERROR,
                "Message cannot be empty",
                HttpStatusCode.BAD_REQUEST
            )
        }

        const sanitizedMessage =
            message.length > MAX_MESSAGE_LENGTH
                ? message.slice(0, MAX_MESSAGE_LENGTH)
                : message;

        let conversationId: string | null | undefined = sessionId

        if (conversationId) {
            const conversationExists =
                await this._conversationRepository.findById(conversationId);

            if (!conversationExists) {
                conversationId = null;
            }
        }

        if (!conversationId) {
            const conversation = await this._conversationRepository.create();
            conversationId = conversation.id;
        }

        await this._messageRepository.create({
            id: randomUUID(),
            conversationId,
            sender: "user",
            text: sanitizedMessage,
            createdAt: new Date(),
        })

        let previousMessages
        const cacheKey = `chat:conversation:${conversationId}`
        const cachedMessages = await this._cacheService.get(cacheKey)

        if (cachedMessages) {
            previousMessages = JSON.parse(cachedMessages);
        } else {
            previousMessages = await this._messageRepository.findByConversationId(conversationId)
            await this._cacheService.set(
                cacheKey,
                JSON.stringify(previousMessages),
                600
            )
        }
        const history = previousMessages.map((msg: Message) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text
        }))

        if (message.trim().length < 2) {
            return {
                reply: "Could you please clarify what you need help with?",
                sessionId: conversationId
            };
        }

        const reply = await this._llmService.generateReply(history, sanitizedMessage)

        await this._messageRepository.create({
            id: randomUUID(),
            conversationId,
            sender: "ai",
            text: reply,
            createdAt: new Date()
        })

        return {
            reply,
            sessionId: conversationId
        }

    }
}