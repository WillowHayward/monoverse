import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class ApiController {
    @Get('test')
    test() {
        return 'g';
    }

}
