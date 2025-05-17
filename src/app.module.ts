import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { UrlModule } from './domain/url/url.module';

@Module({
  imports: [CoreModule, UrlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
