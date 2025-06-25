import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue({
        id: 'user-id',
        email: 'test@email.com',
        password: 'hashed',
      }),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-token'),
    };

    authService = new AuthService(
      usersService as UsersService,
      jwtService as JwtService,
    );
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

    await expect(
      authService.login({ email: 'nope@email.com', password: '123456' }),
    ).rejects.toThrow('Credenciais inválidas');
  });

  it('should return access_token when credentials are correct', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await authService.login({
      email: 'test@email.com',
      password: '123456',
    });

    expect(result).toEqual({ access_token: 'fake-token' });
  });
});
