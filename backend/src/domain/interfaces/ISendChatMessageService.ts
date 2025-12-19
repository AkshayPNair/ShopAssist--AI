import { SendChatMessageDTO } from "../dtos/sendChatMessage.dto";

export interface ISendChatMessageService{
    execute(input:SendChatMessageDTO):Promise<{reply:string,sessionId:string}>
}