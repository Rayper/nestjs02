import { ClassSerializerInterceptor, Controller, Get, Param, Query, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { EventService } from "./event.service";


@Controller('events-organized-by-user/:userId')
@SerializeOptions({strategy: 'excludeAll'})
export class EventsOrganizedByUserController {
    constructor(
        private readonly eventService: EventService
    ) {}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(
        @Param('userId') userId: number,
        @Query('page') page = 1
    ) {
        return await this.eventService.getEventsOrganizedByUserIdPaginated(
            userId,
            { currentPage: page, limit: 3 }
        );
    }
}