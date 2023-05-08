import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChessModule } from './chess/chess.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ChessModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGODB_URI'),
          dbName: configService.get<string>('MONGODB_DB_NAME'),
          auth: {
            user: configService.get<string>('MONGODB_USERNAME'),
            password: configService.get<string>('MONGODB_PASSWORD'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
