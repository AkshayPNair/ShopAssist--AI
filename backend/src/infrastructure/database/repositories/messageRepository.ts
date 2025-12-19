import { pgPool } from "../postgres";
import { Message } from "../../../domain/entities/Message";
import { IMessageRepository } from "../../../domain/interfaces/IMessageRepository";

export class MessageRepository implements IMessageRepository {
    async create(message: Message): Promise<void> {
        await pgPool.query(
            `INSERT INTO messages (id, conversation_id, sender, text)
            VALUES ($1, $2, $3, $4)`,
            [
                message.id,
                message.conversationId,
                message.sender,
                message.text,
            ]
        )
    }

    async findByConversationId(conversationId: string): Promise<Message[]> {
        const result = await pgPool.query(
            `SELECT * FROM messages
            WHERE conversation_id = $1
            ORDER BY created_at ASC`,
            [conversationId]
        )

        return result.rows;
    }
}