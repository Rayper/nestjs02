import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { query } from "express";
import { User } from "src/auth/user.entity";
import { paginate, PaginationOptions } from "src/pagination/paginator";
import { DeleteResult, Repository } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";
import { Event, PaginatedEvents } from "./event.entity";
import { CreateEventDto } from "./input/create-event.dto";
import { ListEvents, WhenEventFilter } from "./input/list.event";
import { UpdateEventDto } from "./input/update-event.dto";


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
        .orderBy('e.id', 'ASC')
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

    private async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
        let query = this.getEventsWithAttendeeCountQuery();
    
        if (!filter) {
          return query;
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
    
        return await query;
      }

      public async getEventWithAttendeeCountFilteredPaginated(
        filter: ListEvents,
        paginateOptions: PaginationOptions
      ): Promise<PaginatedEvents> {
          return await paginate(
            await this.getEventsWithAttendeeCountFiltered(filter),
            paginateOptions
          );         
      }
      
      public async deleteEvent(id: number): Promise<DeleteResult> {
        return await this.eventRepository
        .createQueryBuilder('e')
        .delete()
        .where('id = :id', { id })
        .execute();
    }

    public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
      return await this.eventRepository.save({
        // ambil data dari event create dto
        ...input,
        // ambil data dari user
        organizer: user,
        when: new Date(input.when)
      });
    }

    public async updateEvent(event: Event,input: UpdateEventDto): Promise<Event> {
        return await this.eventRepository.save({
          // copy semua property dari index yang didapet
          ...event,
          // ambil property yang diupdate, karena optional
          ...input,
          // cek apakah input provided, jika iya crete new Date object
          when: input.when ? new Date(input.when) : event.when
      });
    }

    public async getEventsAttendedByUserIdPaginated(
        userId: number, paginateOptions: PaginationOptions
    ): Promise<PaginatedEvents> {
      return await paginate<Event>(
        this.getEventsAttendedByUserIdQuery(userId),
        paginateOptions
      );
    }

    private getEventsAttendedByUserIdQuery(
      userId: number
    ) {
      return this.getEventBaseQuery()
      .leftJoinAndSelect('e.attendees', 'a')
      .where('a.userId = :userId', { userId });
    }
}

  
