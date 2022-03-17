import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/user.entity";
import { AttendeesService } from "./attendees.service";
import { CreateAttendeeDto } from "./create-attendee.dto";
import { EventService } from "./event.service";

@Controller('events-attendance')
export class CurrentUserEventAttendanceController {
    constructor(
        private readonly eventsService: EventService,
        private readonly attendeesService: AttendeesService
      ) { }

    @Get()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(
        @CurrentUser() user: User,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1
    ) {
        return await this.eventsService
        .getEventsAttendedByUserIdPaginated(
            user.id, { limit: 3, currentPage: page }
        );
    }

    @Get(':eventId')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(
        // ParseIntPipe supaya eventId tersebut adalah sebuah number
        @Param('eventId', ParseIntPipe) eventId: number,
        @CurrentUser() user: User
    ) {
        const attendee = await this.attendeesService
        .findOneByEventIdAndUserId(
            eventId, user.id
        );

        if (!attendee) {
        throw new NotFoundException();
        }

        return attendee;
    }

    @Put('/:eventId')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async createOrUpdate(
        // ParseIntPipe supaya eventId tersebut adalah sebuah number
        @Param('eventId', ParseIntPipe) eventId: number,
        @Body() input: CreateAttendeeDto,
        @CurrentUser() user: User
    ) {
        return this.attendeesService.createOrUpdate(
        input, eventId, user.id
        );
    }
}