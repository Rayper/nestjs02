import { cp } from "fs";
import { Attendee } from "src/attendee.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// @Entity('event', {name: 'event'})
@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    description: string;
    
    @Column()
    when: Date;
    
    @Column()
    address: string;

    // related property yang mengarah ke attendee
    @OneToMany(() => Attendee, (attendee) => attendee.event)
    attendees: Attendee[];
}