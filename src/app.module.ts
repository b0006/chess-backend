import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BoardsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/task-man'),
  ],
  providers: [AppService],
})
export class AppModule {}
