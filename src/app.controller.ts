import { Controller, Get } from '@nestjs/common';
import * as APP_CONFIG from '@app/app.config';

@Controller()
export class AppController {
  @Get()
  index(): any {
    return APP_CONFIG.INFO;
  }
}
