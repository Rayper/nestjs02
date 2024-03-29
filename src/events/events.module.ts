import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { AttendeesService } from './attendees.service';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventAttendeesController } from './event-attendees.controller';
import { Event } from './event.entity';
import { EventService } from './event.service';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { EventsController } from './events.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Attendee])
    ],
    controllers: [
        EventsController,
        CurrentUserEventAttendanceController,
        EventAttendeesController,
        EventsOrganizedByUserController    
    ],
    providers: [EventService, AttendeesService]
})
export class EventsModule {}
