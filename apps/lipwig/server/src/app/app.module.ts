import { Module } from '@nestjs/common';

import { AppGateway } from './app.gateway';
import { RoomModule } from '../room/room.module';

@Module({
    imports: [RoomModule],
    controllers: [],
    providers: [AppGateway],
})
export class AppModule {}
