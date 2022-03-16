import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { query } from "express";
import { Repository } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";
import { Event } from "./event.entity";
import { ListEvents, WhenEventFilter } from "./input/list.event";


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
            // nama property nya
            'e.attendeeAccepted',
            'e.attendees',
            // alias nya
            'attendee',
            (qb) => qb
            .where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Accepted})
        )
        .loadRelationCountAndMap(
            // nama property nya
            'e.attendeeMaybe',
            'e.attendees',
            // alias nya
            'attendee',
            (qb) => qb
            .where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Maybe})
        )
        .loadRelationCountAndMap(
            // nama property nya
            'e.attendeeRejected',
            'e.attendees',
            // alias nya
            'attendee',
            (qb) => qb
            .where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Rejected})
        )
    }

    public async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
        let query = this.getEventsWithAttendeeCountQuery();
    
        if (!filter) {
          return query.getMany();
        }
    
        if (filter.when) {
          if (filter.when == WhenEventFilter.Today) {
            query = query.andWhere(
              `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`
            );
          }
    
          if (filter.when == WhenEventFilter.Tommorow) {
            query = query.andWhere(
              `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`
            );
          }
    
          if (filter.when == WhenEventFilter.ThisWeek) {
            query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
          }
    
          if (filter.when == WhenEventFilter.NextWeek) {
            query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1');
          }
        }
    
        return await query.getMany();
      }
}
