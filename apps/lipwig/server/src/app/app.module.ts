import { Module } from '@nestjs/common';

import { AppGateway } from '../gateway/app.gateway';
import { RoomService } from '../room/room.service';

@Module({
    imports: [],
    controllers: [],
    providers: [AppGateway, RoomService],
})
export class AppModule {}
