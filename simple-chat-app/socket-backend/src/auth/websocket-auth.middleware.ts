import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Socket } from 'socket.io';
import { isEmpty } from 'class-validator';

@Injectable()
export class WebsocketAuthMiddleware implements NestMiddleware {
	private logger: Logger = new Logger(WebsocketAuthMiddleware.name);

	constructor(private authService: AuthService) {}

	/**
	 * The function is a middleware that checks if a client has a valid authorization token and
	 * disconnects the client if the token is not valid.
	 * @param {Socket} client - The `client` parameter is a Socket object representing the client
	 * connection. It is used to interact with the client, send and receive data.
	 * @param next - The `next` parameter is a function that represents the next middleware function in
	 * the chain. It is called to pass control to the next middleware function.
	 */
	async use(client: Socket, next: () => void) {
		if (isEmpty(client.handshake?.headers?.authorization)) {
			this.logger.error('Auth token not found');
			client.emit('unauthorized', { message: 'Auth token not found' });
			client.disconnect(true); // Disconnect the client if there is no authorization header
			return next();
		}

		try {
			const authToken = client.handshake.headers.authorization;
			await this.authService.validateJwtToken(authToken);
			next();
		} catch (error) {
			this.logger.error('Unauthorized user\nError: ' + error);
			client.emit('unauthorized', { message: 'Unauthorized user' });
			client.disconnect(true); // Disconnect the client if the token is not valid
		}
	}
}
