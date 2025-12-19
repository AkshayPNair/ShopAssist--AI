export interface IConversationRepository {
    create(): Promise<{ id: string }>
    findById(id: string): Promise<any | null>
}