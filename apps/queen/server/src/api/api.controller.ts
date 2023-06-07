import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { Token } from '../decorators/token.decorator';
import { ApiService } from './api.service';

@Controller()
@UseGuards(AuthGuard)
export class ApiController {
    constructor(private api: ApiService) {}

    @Get('repos')
    getRepos(@Token() token: string) {
        return this.api.getUser(token);
    }
}
