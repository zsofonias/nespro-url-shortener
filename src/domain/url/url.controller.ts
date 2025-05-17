import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';

import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlExistsPipe } from './pipes/url-exists.pipe';
import { QueryUrlsDto } from './dto/query-urls.dto';
import { Url } from '@prisma/client';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('urls')
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.create(createUrlDto);
  }

  @Get('urls')
  findAll(@Query() queryUrlsDto: QueryUrlsDto) {
    return this.urlService.findAll(queryUrlsDto);
  }

  @Get(':uid')
  async findOne(@Param('uid', UrlExistsPipe) url: Url, @Res() res: Response) {
    res.redirect(url.redirect);
  }

  @Patch(':uid')
  update(
    @Param('uid', UrlExistsPipe) url: Url,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    return this.urlService.findOneByIdAndUpdate(url.id, updateUrlDto);
  }

  @Delete(':uid')
  remove(@Param('uid', UrlExistsPipe) url: Url) {
    return this.urlService.findOneByIdAndDelete(url.id);
  }
}
