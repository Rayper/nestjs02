import { Attendee } from "src/events/attendee.entity";
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
    // bisa pakai eager seperti ini
    // atau bisa pake relations pada controller
    // @OneToMany(() => Attendee, (attendee) => attendee.event, {
    //     eager: true
    // })
    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        cascade: true
    })
    attendees: Attendee[];
}