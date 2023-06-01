import { Controller, Get, Post, Query, Redirect, Req } from '@nestjs/common';
import { Request } from 'express';
import { map } from 'rxjs';
import { AuthTokenRequest } from '@whc/queen/model';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    private state: string = '';
    constructor(private readonly auth: AuthService) {}

    @Get()
    getData() {
        const data = this.auth.getInitData();
        this.state = data.state;
        return data;
    }

    @Get('redirect')
    @Redirect()
    getRedirect(@Query() data: AuthTokenRequest) {
        console.log(data);

        return this.auth.getToken(this.state, data).pipe(map(response => {
            console.log(response);

            const token = response.token;

            return {
                url: `/?token=${token}&return=test`
            }
        }));
    }

    @Get('test')
    getTest(@Req() req: Request) { // TODO: Move to @Headers()
        const token = req.headers.authorization.split(' ')[1];

        return this.auth.getTest(token).pipe(map(resp => {
            return resp.data;
        }));
    }
}
