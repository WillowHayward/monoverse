import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

const QUEEN_SECRET = process.env['QUEEN_SECRET'];

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwt: JwtService, private users: UsersService) {}

    canActivate(
        context: ExecutionContext
    ): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        let payload: { id: number };

        try {
            payload = this.jwt.verify(token, {
                secret: QUEEN_SECRET
            });
        } catch (err) {
            throw new UnauthorizedException('Invalid Token');
        }

        const userId = payload.id;

        const user = this.users.findUserById(userId);
        if (!user) {
            throw new UnauthorizedException('Could not find user'); 
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
