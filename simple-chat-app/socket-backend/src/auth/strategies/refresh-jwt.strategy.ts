import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserDTO } from "src/user/user.dto";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor(
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'), // Use the ConfigService to get the secret
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, username: payload.username } as UserDTO;
    }
}