import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./events/event.entity";

@Entity()
export class Attendee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
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
}