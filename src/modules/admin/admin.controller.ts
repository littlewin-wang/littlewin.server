/**
 * @file 管理员模块控制器
 * @author littlewin<littlewin.wang@gmail.com>
 */

import * as APP_CONFIG from '@app/app.config';
import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin, Login } from './admin.model';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get()
  getAdmin(): Promise<Admin> {
    return this.adminService.getAdminInfo();
  }
}
