import { pgPool } from "../postgres";   
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";

export class ConversationRepository implements IConversationRepository{
    async create(): Promise<{ id: string; }> {
        const result = await  pgPool.query(
            `INSERT INTO conversations DEFAULT VALUES RETURNING id`
        )
        return {id:result.rows[0].id}
    }

    async findById(id: string): Promise<any | null> {
        const result = await pgPool.query(
            `SELECT * FROM conversations WHERE id = $1`,
            [id]
        )
        return result.rows[0] || null
    }
}