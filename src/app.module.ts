import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from '@app/processors/database/database.module';
import { AdminModule } from '@app/modules/admin/admin.module';

@Module({
  imports: [
    DatabaseModule,
    AdminModule
  ],
  controllers: [AppController],
})
export class AppModule {}
