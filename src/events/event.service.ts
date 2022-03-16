import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
        const query = this.getEventBaseQuery()
        .andWhere('e.id = :id', { id });

        // print sql yang generate getEvent
        this.logger.debug(query.getSql());

        return await query.getOne();
    }

}