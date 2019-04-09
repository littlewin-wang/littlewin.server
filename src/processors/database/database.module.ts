/**
 * @file Database 全局模块
 * @author littlewin<littlewin.wang@gmail.com>
 */

import { Module, Global } from '@nestjs/common';
import { databaseProvider } from './database.provider';

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
