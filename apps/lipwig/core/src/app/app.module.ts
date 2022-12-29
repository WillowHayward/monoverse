import { Module } from '@nestjs/common';

import { LipwigGateway } from './lipwig.gateway';

@Module({
    imports: [],
    controllers: [],
    providers: [LipwigGateway],
})
export class AppModule {}
