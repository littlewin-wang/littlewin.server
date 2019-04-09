/**
 * @file 管理员数据模块
 * @author littlewin<littlewin.wang@gmail.com>
 */

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './admin.model';

@Module({
  imports: [
    TypegooseModule.forFeature(Admin),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
