/**
 * @file 管理员数据模型
 * @author littlewin<littlewin.wang@gmail.com>
 */

import { prop, Typegoose } from 'typegoose';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class Admin extends Typegoose {
  @IsDefined()
  @IsString({ message: 'Your name? ' })
  @prop({ default: '' })
  name: string;

  @prop()
  password?: string;

  @IsDefined()
  @IsString({ message: 'Your slogan？' })
  @prop({ default: '' })
  slogan: string;

  @IsDefined()
  @IsString({ message: 'Your gravatar？' })
  @prop({ default: '' })
  gravatar: string;

  new_password?: string;
  rel_new_password?: string;
}

export class Login extends Typegoose {
  @IsDefined()
  @IsNotEmpty({ message: 'Password？' })
  @IsString({ message: 'Your password？' })
  password: string;
}
