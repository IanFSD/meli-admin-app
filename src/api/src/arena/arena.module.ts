import {Module} from '@nestjs/common';
import {ArenaService} from "./arena.service";

@Module({
    providers: [ArenaService],
    exports: [ArenaService],
})
export class ArenaModule {
}
