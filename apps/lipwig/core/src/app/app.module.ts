import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { LipwigGateway } from './lipwig.gateway';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [LipwigGateway],
})
export class AppModule {}
