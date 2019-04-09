/**
 * @file 管理员模块服务
 * @author littlewin<littlewin.wang@gmail.com>
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { Admin } from './admin.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private readonly adminModel: TMongooseModel<Admin>,
  ) {}

  // 获取管理员信息
  public getAdminInfo(): Promise<Admin> {
    return this.adminModel.findOne(null, '-_id name slogan gravatar').exec();
  }
}
