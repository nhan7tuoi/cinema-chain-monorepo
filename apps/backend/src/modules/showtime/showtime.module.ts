import { Module } from "@nestjs/common";
import { ShowtimeController } from "./showtime.controller";
import { ShowtimeClientController } from "./showtime-client.controller";
import { ShowtimeService } from "./showtime.service";

@Module({
    controllers: [ShowtimeController, ShowtimeClientController],
    providers: [ShowtimeService],
    exports: [ShowtimeService],
})
export class ShowtimeModule { } 