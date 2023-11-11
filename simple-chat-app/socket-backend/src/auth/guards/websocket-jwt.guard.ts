import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
} from '@nestjs/common';
import { WebsocketAuthMiddleware } from '../websocket-auth.middleware';

@Injectable()
export class WebsocketJwtGuard implements CanActivate {
	private logger: Logger = new Logger(WebsocketJwtGuard.name);

	constructor(private websocketAuthMiddleware: WebsocketAuthMiddleware) {}

	/**
	 * The `canActivate` function checks if the context is a websocket and performs authentication using
	 * a middleware before allowing access.
	 * @param {ExecutionContext} context
	 */
	async canActivate(context: ExecutionContext) {
		// if the context is not of type websocket return true
		if (context.getType() !== 'ws') {
			return true;
		}

		const client = context.switchToWs().getClient();
		await this.websocketAuthMiddleware.use(client, () => {});
		return true;
	}
}
