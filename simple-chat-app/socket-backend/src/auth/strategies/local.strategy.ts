import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDTO } from 'src/user/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
        usernameField: 'username',
        passwordField: 'password'
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({username, password} as UserDTO);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}