import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const OptionalUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
        const decoded = jwtService.verify(token);
        return decoded;
      } catch (error) {
        return null;
      }
    }
    return null;
  },
);
