import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LipwigGateway } from './lipwig.gateway';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, LipwigGateway],
})
export class AppModule {}
