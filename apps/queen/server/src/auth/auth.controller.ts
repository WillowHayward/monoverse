import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AuthTokenRequest } from '@whc/queen/model';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    private state: string = '';
    constructor(private readonly auth: AuthService) {}

    @Get()
    async getData() {
        const data = await this.auth.initAuth();
        this.state = data.state;
        return data;
    }

    @Get('redirect')
    @Redirect()
    async getRedirect(@Query() data: AuthTokenRequest) {
        return this.auth.getToken(this.state, data).then(response => {
            console.log(response);

            const token = response.token;
            const expiry = response.expiry;

            return {
                url: `/login?token=${token}&expiry=${expiry}`
            }
        });
    }
}
