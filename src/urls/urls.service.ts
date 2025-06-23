import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Url } from './urls.entity';
import { nanoid } from 'nanoid';
import { User } from 'src/users/users.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async createShortUrl(originalUrl: string, userId?: string): Promise<string> {
    const shortCode: string = nanoid(6);

    const url = this.urlRepository.create({
      originalUrl,
      shortCode,
      user: userId ? ({ id: userId } as User) : undefined,
    });

    await this.urlRepository.save(url);
    return `http://localhost:3000/${shortCode}`;
  }

  async handleRedirect(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findOne({
      where: { shortCode, deletedAt: IsNull() },
    });
    if (!url) {
      throw new NotFoundException('URL não encontrada tamo aq?');
    }
    url.clicks += 1;
    await this.urlRepository.save(url);

    return url.originalUrl;
  }

  async listUserUrls(userId: string): Promise<Url[]> {
    return this.urlRepository.find({
      where: { user: { id: userId }, deletedAt: IsNull() },
    });
  }

  async updateUserUrl(
    id: string,
    newUrl: string,
    userId: string,
  ): Promise<{ message: string }> {
    const url = await this.urlRepository.findOne({
      where: { id, user: { id: userId }, deletedAt: IsNull() },
    });

    if (!url)
      throw new NotFoundException(
        'URL não encontrada ou não pertence ao seu usuário',
      );

    url.originalUrl = newUrl;
    await this.urlRepository.save(url);

    return { message: 'URL atualizada com sucesso' };
  }

  async deleteUserUrl(
    id: string,
    userId: string,
  ): Promise<{ message: string }> {
    const url = await this.urlRepository.findOne({
      where: { id, user: { id: userId }, deletedAt: IsNull() },
    });

    if (!url)
      throw new NotFoundException(
        'URL não encontrada ou não pertence ao seu usuário',
      );

    url.deletedAt = new Date();
    await this.urlRepository.save(url);

    return { message: 'URL removida com sucesso!' };
  }
}
