import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthTokenRequest } from '@whc/queen/model';

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

    @Post()
    getToken(@Body() data: AuthTokenRequest) {
        return this.appService.getToken(this.state, data);
    }
}
