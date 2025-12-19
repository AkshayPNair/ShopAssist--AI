import { Message } from "../entities/Message";

export interface IMessageRepository {
  create(message: Message): Promise<void>
  findByConversationId(conversationId: string): Promise<Message[]>
}
