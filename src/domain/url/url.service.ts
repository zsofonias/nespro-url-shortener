import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UniqueIdService } from 'src/services/unique-id/unique-id.service';
import { DatabaseService } from 'src/database/database.service';

import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

import { Prisma, Url } from '@prisma/client';
import { QueryUrlsDto } from './dto/query-urls.dto';

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

  async findAll(queryUrlsDto: QueryUrlsDto) {
    const { q, title, page, limit } = queryUrlsDto;

    let whereClause: Prisma.UrlWhereInput = {};

    if (title) {
      whereClause = {
        AND: [
          whereClause,
          {
            title,
          },
        ],
      };
    }

    if (q) {
      whereClause = {
        AND: [
          whereClause,
          {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { shortUrl: { contains: q, mode: 'insensitive' } },
              { redirect: { contains: q, mode: 'insensitive' } },
            ],
          },
        ],
      };
    }

    const skip = (page - 1) * limit;

    const data = await this.databaseService.url.findMany({
      where: whereClause,
      skip,
      take: limit,
    });

    const totalCount = await this.databaseService.url.count({
      where: whereClause,
    });

    const queryString = q ? `q=${q}` : '';

    const meta = {
      pageItems: data.length,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      nextPage: `${this.host}/urls?${queryString}&limit=${limit}&page=${totalCount > limit ? page + 1 : page}`,
      prevPage: `${this.host}/urls?${queryString}&limit=${limit}&page=${page > 1 ? page - 1 : 1}`,
    };

    return {
      data,
      meta,
    };
  }

  async findOne(filter: Prisma.UrlWhereInput): Promise<Url | null> {
    return await this.databaseService.url.findFirst({
      where: filter,
    });
  }

  async findOneWithException(filter: Prisma.UrlWhereInput): Promise<Url> {
    const url = await this.findOne(filter);
    if (!url) {
      throw new NotFoundException('Url data not found.');
    }
    return url;
  }

  async findOneByUidAndUpdate(uid: string, updateUrlDto: UpdateUrlDto) {
    const url = await this.databaseService.url.findFirst({
      where: {
        shortUrl: {
          contains: uid,
          mode: 'insensitive',
        },
      },
    });

    if (!url) {
      throw new NotFoundException('Url data not found');
    }

    return await this.databaseService.url.update({
      where: {
        id: url.id,
      },
      data: updateUrlDto,
    });
  }

  async findOneByIdAndUpdate(id: string, updateUrlDto: UpdateUrlDto) {
    return await this.databaseService.url.update({
      where: {
        id,
      },
      data: updateUrlDto,
    });
  }

  async findOneByIdAndDelete(id: string) {
    return await this.databaseService.url.delete({
      where: {
        id,
      },
    });
  }
}
