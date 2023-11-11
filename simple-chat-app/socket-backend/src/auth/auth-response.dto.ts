import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class AuthResponseDTO {
	@Expose()
	@IsOptional()
	access_token: string;

	@Expose()
	@IsOptional()
	refresh_token: string;

	@Expose()
	@IsOptional()
	expiry: string;
}
