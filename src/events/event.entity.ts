import { cp } from "fs";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}