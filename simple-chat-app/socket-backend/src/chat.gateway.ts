import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: 'http://127.0.0.1:3001',
        credentials: true,
      },
      allowEIO3: true,
})
export class ChatGateway {
    @WebSocketServer() server: Server;
    
    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string) {
        this.server.emit('message', message);
    }
}