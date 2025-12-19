import { Request, Response, NextFunction } from "express";
import { ISendChatMessageService } from "../../domain/interfaces/ISendChatMessageService";
import { HttpStatusCode } from "../../utils/httpStatusCode";
import { IMessageRepository } from "../../domain/interfaces/IMessageRepository";

export class ChatController {
    constructor(
        private readonly _sendChatMessageService: ISendChatMessageService,
        private readonly _messageRepository: IMessageRepository
    ) { }

    async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._sendChatMessageService.execute(req.body)
            return res.status(HttpStatusCode.OK).json({ success: true, data: result })
        } catch (error) {
            next(error)
        }
    }

    async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { sessionId } = req.params;

            const messages = await this._messageRepository.findByConversationId(sessionId)

            return res.status(200).json({
                success: true,
                data: messages,
            })
        } catch (error) {
            next(error)
        }
    }
}