export interface Message{
    id:string;
    conversationId:string;
    sender:'user' | 'ai';
    text:string;
    createdAt:Date;
}