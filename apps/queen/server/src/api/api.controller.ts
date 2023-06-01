import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';

@Controller('v1')
@UseGuards(AuthGuard)
export class ApiController {
    @Get()
    test() {
        return 'g';
    }

}
