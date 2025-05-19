import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UrlService } from '../url.service';
import { UrlExistsPipe } from './url-exists.pipe';
import { Url } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('UrlExistsPipe', () => {
  let urlExistsPipe: UrlExistsPipe;
  let urlServcie: DeepMocked<UrlService>;

  beforeEach(async () => {
    urlServcie = createMock<UrlService>();
    urlExistsPipe = new UrlExistsPipe(urlServcie);
  });

  it('should be defined', () => {
    expect(urlExistsPipe).toBeDefined();
  });

  // happy path
  it('should return url data', async () => {
    let url: Url = {
      id: 'valid-uid',
      shortUrl: 'valid-uid',
      redirect: 'valid-long-url',
      title: 'valid-title',
      description: 'valid-description',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    urlServcie.findOneWithException.mockResolvedValueOnce(url);

    const result = await urlExistsPipe.transform('valid-uid');

    expect(result).toEqual(url);
  });

  // unhappy path
  it('should throw an exception when no url is found', async () => {
    urlServcie.findOneWithException.mockRejectedValueOnce(
      new NotFoundException('Url data not found'),
    );
    await expect(() => urlExistsPipe.transform('invalid-uid')).rejects.toThrow(
      NotFoundException,
    );
  });
});
