import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";
import { Event } from "./event.entity";


@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name);

    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>
    ) {}


    private getEventBaseQuery() {
        return this.eventRepository
        .createQueryBuilder('e')
        .orderBy('e.id', 'DESC')
    }

    public async getEvent(id: number): Promise<Event> | undefined {
        const query = this.getEventsWithAttendeeCountQuery()
        .andWhere('e.id = :id', { id });

        // print sql yang generate getEvent
        this.logger.debug(query.getSql());

        return await query.getOne();
    }

    public getEventsWithAttendeeCountQuery() {
        return this.getEventBaseQuery()
        .loadRelationCountAndMap(
            // nama kolom, relation-nya
            'e.attendeecount', 'e.attendees'
        )
        .loadRelationCountAndMap(
            'e.attendeeAccepted',
            'e.attendees',
            // alias nya
            'attendee',
            (qb) => qb
            .where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Accepted})
        )
        .loadRelationCountAndMap(
            'e.attendeeMaybe',
            'e.attendees',
            // alias nya
            'attendee',
            (qb) => qb
            .where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Maybe})
        )
        .loadRelationCountAndMap(
            'e.attendeeRejected',
            'e.attendees',
            // alias nya
            'attendee',
            (qb) => qb
            .where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Rejected})
        )
    }

}