import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'usuario@exemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  password: string;
}
