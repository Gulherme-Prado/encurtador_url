import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlDto {
  @ApiProperty({ example: 'https://www.google.com' })
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
