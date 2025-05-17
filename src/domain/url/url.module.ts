import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UniqueIdModule } from 'src/services/unique-id/unique-id.module';

@Module({
  imports: [UniqueIdModule],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
