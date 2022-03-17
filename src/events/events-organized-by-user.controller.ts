import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, SerializeOptions, UseInterceptors } from "@nestjs/common";
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
        @Param('userId', ParseIntPipe) userId: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1
      ) {
        return await this.eventService
          .getEventsOrganizedByUserIdPaginated(
            userId,
            { currentPage: page, limit: 3 }
          );
      }
}