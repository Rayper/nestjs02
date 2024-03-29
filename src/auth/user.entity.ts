import { Exclude, Expose } from "class-transformer";
import { Attendee } from "src/events/attendee.entity";
import { Event } from "src/events/event.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column({unique: true})
    @Expose()
    username: string;

    @Column()
    password: string;

    @Column({unique: true})
    @Expose()
    email: string;

    @Column()
    @Expose()
    firstName: string;

    @Column()
    @Expose()
    lastName: string;

    @OneToOne(() => Profile)
    @JoinColumn()
    @Expose()
    profile: Profile;

    // hanya sebagai virtual property tidak dijadikan column
    @OneToMany(() => Event, (event) => event.organizer)
    @Expose()
    organized: Event[];

    @OneToMany(() => Attendee, (attendee) => attendee.user)
    attendeed: Attendee[];
}