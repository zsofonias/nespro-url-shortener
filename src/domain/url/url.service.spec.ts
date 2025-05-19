import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { UniqueIdService } from '../../services/unique-id/unique-id.service';
import { DatabaseService } from '../../database/database.service';
import { UrlService } from './url.service';

import { Url } from '@prisma/client';

describe('UrlService', () => {
  let urlServcie: UrlService;
  let uidService: DeepMocked<UniqueIdService>;
  let configService: DeepMocked<ConfigService>;
  let databaseService: DeepMockProxy<DatabaseService>;

  let host = 'localhost:3000';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: UniqueIdService,
          useValue: createMock<UniqueIdService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
      ],
    }).compile();

    const app = module.createNestApplication();

    urlServcie = module.get<UrlService>(UrlService);
    uidService = module.get(UniqueIdService);
    configService = module.get(ConfigService);
    configService.getOrThrow.mockReturnValueOnce(host);
    databaseService = module.get(DatabaseService);

    await app.init();
  });

  it('should be defined', () => {
    expect(urlServcie).toBeDefined();
  });

  describe('create', () => {
    it('should create a new url', async () => {
      const payload = {
        redirect: 'https://google.com',
        title: 'Google',
        description: 'Search Engine',
      };

      const mockedUrl: Url = {
        ...payload,
        id: 'slkdjflksd',
        shortUrl: `${host}/qwert`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      uidService.generate.mockReturnValueOnce('qwert');
      databaseService.url.create.mockResolvedValueOnce(mockedUrl);
      const result = await urlServcie.create(payload);

      expect(result).toEqual(mockedUrl);
    });
  });
});
