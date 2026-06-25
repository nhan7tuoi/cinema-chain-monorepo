import { Module } from "@nestjs/common";
import { ShowtimeController } from "./showtime.controller";
import { ShowtimeService } from "./showtime.service";

@Module({
    controllers: [ShowtimeController],
    providers: [ShowtimeService],
    exports: [ShowtimeService],
})
export class ShowtimeModule { } 