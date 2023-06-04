import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

const QUEEN_SECRET = process.env['QUEEN_SECRET'];

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwt: JwtService) {}

    canActivate(
        context: ExecutionContext
    ): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException();
        }


        try {
            this.jwt.verify(token, {
                secret: QUEEN_SECRET
            });
        } catch (err) {
            throw new UnauthorizedException('Invalid Token');
        }

        return true;
    }

    private extractToken(request: Request): string | undefined {
        const [type, token] = request.headers?.authorization.split(' ') || [];

        if (type !== 'token') {
            return undefined;
        }

        return token;
    }
}
