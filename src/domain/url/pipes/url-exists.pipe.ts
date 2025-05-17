import { Injectable, PipeTransform } from '@nestjs/common';
import { UrlService } from '../url.service';

@Injectable()
export class UrlExistsPipe implements PipeTransform {
  constructor(private readonly urlService: UrlService) {}

  async transform(uid: string) {
    const url = await this.urlService.findOneWithException({
      shortUrl: {
        contains: uid,
        mode: 'insensitive',
      },
    });

    return url;
  }
}
