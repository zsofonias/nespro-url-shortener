import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    description: 'Full url that is needed to be redirected',
    example: 'https://thisisaverylonglogndomain.com/',
  })
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  redirect: string;

  @ApiProperty({
    description: 'Url name',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Url description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
