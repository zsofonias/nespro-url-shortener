import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

import { UniqueIdService } from 'src/services/unique-id/unique-id.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  private host: string;

  constructor(
    private readonly uniqueIdService: UniqueIdService,
    private readonly databaseService: DatabaseService,

    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.host = this.configService.getOrThrow<string>('host');
  }

  async create(createUrlDto: CreateUrlDto) {
    const randomId = this.uniqueIdService.generate({ size: 5 });
    const shortUrl = `${this.host}/${randomId}`;
    const url = await this.databaseService.url.create({
      data: {
        ...createUrlDto,
        shortUrl,
      },
    });
    return {
      url,
      shortUrl,
    };
  }

  async findAll() {
    console.log(this.configService.getOrThrow<string>('host'));
    return await this.databaseService.url.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} url`;
  }

  update(id: string, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${id} url`;
  }

  remove(id: string) {
    return `This action removes a #${id} url`;
  }
}
