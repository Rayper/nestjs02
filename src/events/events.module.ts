import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { AttendeesService } from './attendees.service';
import { Event } from './event.entity';
import { EventService } from './event.service';
import { EventsController } from './events.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Attendee])
    ],
    controllers: [EventsController],
    providers: [EventService, AttendeesService]
})
export class EventsModule {}
