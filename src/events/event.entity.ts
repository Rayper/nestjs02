import { Exclude, Expose } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Attendee } from "src/events/attendee.entity";
import { PaginationResult } from "src/pagination/paginator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// @Entity('event', {name: 'event'})
@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column()
    @Expose()
    name: string;
    
    @Column()
    @Expose()
    description: string;
    
    @Column()
    @Expose()
    when: Date;
    
    @Column()
    @Expose()
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

    @ManyToOne(() => User, (user) => user.organized)
    @Expose()
    organizer: User;

    // id dari user yang membuat sebuah event
    @Column({ nullable: true })
    // @Exclude()
    organizerId: number;

    @Expose()
    attendeeCount?: number;
    @Expose()
    attendeeRejected?: number;
    @Expose()
    attendeeMaybe?: number;
    @Expose()
    attendeeAccepted?: number;
}

export type PaginatedEvents = PaginationResult<Event>;