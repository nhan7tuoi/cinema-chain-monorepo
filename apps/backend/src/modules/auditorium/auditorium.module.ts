import { Module } from "@nestjs/common";
import { AuditoriumController } from "./auditorium.controller";
import { AuditoriumService } from "./auditorium.service";

@Module({
    imports: [],
    providers: [AuditoriumService],
    exports: [AuditoriumService],
    controllers: [AuditoriumController]
})
export class AuditoriumModule { }
