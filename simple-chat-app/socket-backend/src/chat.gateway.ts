import { Logger, UseGuards } from '@nestjs/common';
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketJwtGuard } from './auth/guards/websocket-jwt.guard';
import { WebsocketAuthMiddleware } from './auth/websocket-auth.middleware';

@UseGuards(WebsocketJwtGuard)
@WebSocketGateway({
	// these are needed for html client to avoid cors error
	cors: {
		origin: 'http://127.0.0.1:3001',
		credentials: true,
	},
	allowEIO3: true,
})
export class ChatGateway {
	private logger: Logger = new Logger(ChatGateway.name);

	constructor(private webSocketAuthMiddleware: WebsocketAuthMiddleware) {}

	@WebSocketServer() server: Server;

	/**
	 * The function "handleConnection" is an asynchronous function that handles a WebSocket connection by
	 * using a WebSocket authentication middleware.
	 * @param {Socket} client
	 * @param {any[]} args
	 */
	async handleConnection(client: Socket, ...args: any[]) {
		// as it is a websocket connection we can pass empty function as next function
		await this.webSocketAuthMiddleware.use(client, () => {});
	}

	@SubscribeMessage('message')
	handleMessage(@MessageBody() message: string) {
		this.server.emit('message', message);
	}
}

/**
 * Notes:
 * Use Guards only verifies the messages, it allows to connect with gateway without auth
 * Hence we have to use handleConnection function
 */
