import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Attendee } from "./attendee.entity";
import { CreateAttendeeDto } from "./create-attendee.dto";

@Injectable()
export class AttendeesService{
    constructor(
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>
    ) {

    }

    public async findByEventId(eventId: number): Promise<Attendee[]> {
        return await this.attendeeRepository.find({
            event: { id: eventId }
        });
    }

    public async findOneByEventIdAndUserId(
        eventId: number, userId: number
      ): Promise<Attendee | undefined> {
        return await this.attendeeRepository.findOne(
          {
            event: { id: eventId },
            user: { id: userId }
          }
        );
      }

      public async createOrUpdate(
        input: CreateAttendeeDto, eventId: number, userId: number
      ): Promise<Attendee> {
        const attendee = await this.findOneByEventIdAndUserId(eventId, userId)
          ?? new Attendee();
    
        attendee.eventId = eventId;
        attendee.userId = userId;
        attendee.answer = input.answer;
        // Rest of input...
    
        return await this.attendeeRepository.save(attendee);
      }
}