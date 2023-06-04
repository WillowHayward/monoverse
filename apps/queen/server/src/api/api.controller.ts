import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { ApiService } from './api.service';
import { Token } from './token.decorator';

@Controller()
@UseGuards(AuthGuard)
export class ApiController {
    constructor(private api: ApiService) {}

    @Get('test')
    test(@Token() token: string) {

        return this.api.getUser(token);
    }

}
