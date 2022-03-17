import { Expose } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

export enum AttendeeAnswerEnum {
    Accepted = 1,
    Maybe, 
    Rejected
}

@Entity()
export class Attendee {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column()
    @Expose()
    name: string;

    @ManyToOne(() => Event, (event) => event.attendees, {
        nullable: false
    })
    // custom nama kolom untuk join
    // @JoinColumn({
    //     name: 'event_id'
    // })
    @JoinColumn() 
    event: Event;

    @Column()
    eventId: number;

    @Column('enum', {
        enum: AttendeeAnswerEnum,
        // default value-nya
        default: AttendeeAnswerEnum.Accepted
    })
    @Expose()
    answer: AttendeeAnswerEnum;

    @ManyToOne(() => User, (user) => user.attendeed)
    user: User;

    @Column()
    userId: number;
}