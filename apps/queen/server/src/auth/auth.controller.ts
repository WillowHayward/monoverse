import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { map } from 'rxjs';
import { AuthTokenRequest } from '@whc/queen/model';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    private state: string = '';
    constructor(private readonly auth: AuthService) {}

    @Get()
    getData() {
        const data = this.auth.initAuth();
        this.state = data.state;
        return data;
    }

    @Get('redirect')
    @Redirect()
    getRedirect(@Query() data: AuthTokenRequest) {
        return this.auth.getToken(this.state, data).pipe(map(response => {
            console.log(response);

            const token = response.token;

            return {
                url: `/?token=${token}&return=test`
            }
        }));
    }
}
