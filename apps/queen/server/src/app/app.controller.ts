import { Body, Controller, Get, Post, Query, Redirect, Req } from '@nestjs/common';
import { Request } from 'express';
import { map } from 'rxjs';
import { AuthTokenRequest, GiteaTokenResponse } from '@whc/queen/model';

import { AppService } from './app.service';

@Controller('auth')
export class AppController {
    private state: string = '';
    constructor(private readonly appService: AppService) {}

    @Get()
    getData() {
        const data = this.appService.getInitData();
        this.state = data.state;
        return data;
    }

    @Get('redirect')
    @Redirect()
    getRedirect(@Query() data: AuthTokenRequest) {
        console.log(data);

        return this.appService.getToken(this.state, data).pipe(map(response => {
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

        return this.appService.getTest(token).pipe(map(resp => {
            return resp.data;
        }));
    }
}
