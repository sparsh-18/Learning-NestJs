import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat.gateway';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: 'mysql',
				database: config.get<string>('MYSQL_DATABASE'),
				entities: [User],
				synchronize: true,
				logging: true,
				port: parseInt(config.get<string>('MYSQL_PORT')),
				host: config.get<string>('MYSQL_DOCKER_IMAGE_NAME'),
				username: config.get<string>('MYSQL_USERNAME'),
				password: config.get<string>('MYSQL_PASSWORD')
			}),
		}),
		UserModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		ChatGateway,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
