/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { defaultConfig } from './app/defaults.model';

import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new WsAdapter(app));
    const port = defaultConfig.port;
    await app.listen(port);
    Logger.log(
        `🚀 Application is running on: http://localhost:${port}`
    );
}

bootstrap();
