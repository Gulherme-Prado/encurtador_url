import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Req,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Response } from 'express';
import { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import { OptionalUser } from 'src/common/decorators/optional-user.decorator';
import { ApiTags, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('URLs')
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls/shorten')
  @ApiBody({ type: ShortenUrlDto })
  async shortenUrl(
    @Body() dto: ShortenUrlDto,
    @OptionalUser() user: any,
  ): Promise<{ shortUrl: string }> {
    const userId: string | undefined = user?.sub;
    const shortUrl = await this.urlsService.createShortUrl(
      dto.originalUrl,
      userId,
    );
    return { shortUrl };
  }

  @Get('urls')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async listUserUrls(@Req() req: AuthRequest) {
    return this.urlsService.listUserUrls(req.user.id);
  }

  @Put('urls/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateUrlDto })
  @UseGuards(JwtAuthGuard)
  async updateUrl(
    @Param('id') id: string,
    @Body() dto: UpdateUrlDto,
    @Req() req: AuthRequest,
  ): Promise<{ message: string }> {
    return this.urlsService.updateUserUrl(
      id,
      dto.originalUrl,
      (req.user as any).id,
    );
  }

  @Delete('urls/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard)
  async deleteUrl(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<{ message: string }> {
    return this.urlsService.deleteUserUrl(id, (req.user as any).id);
  }

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ): Promise<void> {
    const originalUrl = await this.urlsService.handleRedirect(shortCode);
    res.redirect(originalUrl);
  }
}
