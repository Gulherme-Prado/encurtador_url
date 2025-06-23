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
import { Request, Response } from 'express';
import { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls/shorten')
  async shortenUrl(
    @Body() dto: ShortenUrlDto,
    @Req() req: AuthRequest,
  ): Promise<{ shortUrl: string }> {
    const userId: string | undefined = (req.user as any)?.id;
    const shortUrl = await this.urlsService.createShortUrl(
      dto.originalUrl,
      userId,
    );
    return { shortUrl };
  }

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ): Promise<void> {
    const originalUrl = await this.urlsService.handleRedirect(shortCode);
    res.redirect(originalUrl);
  }

  @Get('urls')
  @UseGuards(JwtAuthGuard)
  async listUserUrls(@Req() req: AuthRequest) {
    return this.urlsService.listUserUrls(req.user.id);
  }

  @Put('urls/:id')
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
  @UseGuards(JwtAuthGuard)
  async deleteUrl(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<{ message: string }> {
    return this.urlsService.deleteUserUrl(id, (req.user as any).id);
  }
}
