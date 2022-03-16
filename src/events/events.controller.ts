import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, MoreThan, Repository } from "typeorm";
import { Attendee } from "./attendee.entity";
import { CreateEventDto } from "./create-event.dto";
import { Event } from "./event.entity";
import { UpdateEventDto } from "./update-event.dto";

@Controller('/events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>,
        @InjectRepository(Attendee)
        private readonly attendeerepository: Repository<Attendee>
    ) {

    }

    @Get()
    async findAll() {
        // this.logger.log(`Hit the findAll routes`);
        // const events = await this.repository.find();
        // this.logger.debug(`Found ${events.length} events`);
        // return events;
        return this.repository.find();
    }

    @Get('/practice')
    async practice() {
        // sama aja kayak select * from event where id = 3
        return this.repository.find({
            // cuma ambil fields id sama when
            // select: ['id', 'when'],
            // where: {id: 3}
            // where: {id: MoreThan(3)}
            where: [{
                id: MoreThan(1),
                when: MoreThan(new Date('2021-02-12T13:00:00'))
            }, {
                // description LIKE %meet%
                description: Like('%meet%')
            }],
            // Limit = 2
            take: 2,
            // order by id DESC 
            order: {
                id: 'DESC'
            }
        });
    }

    @Get('practice2')
    async practice2() {
        // return await this.repository.find({relations: ['attendees']});
        const event = await this.repository.findOne(1, {relations: ['attendees']});

        // const event = new Event();
        // event.id = 1;

        const attendee = new Attendee();

        attendee.name = 'Cascade Test';
        // attendee.event = event;

        event.attendees.push(attendee);
        // event.attendees = [];

        // await this.attendeerepository.save(attendee);
        await this.repository.save(event);

        return event;
    }

    @Get(':id')
    // kalau ga dipassing namanya akan membentuk sebuah object
    // ParseIntPipe akan ubah id menjadi int/number
    async findOne(@Param('id') id) {
        // console.log("id : ", typeof id);
        const event = await this.repository.findOne(id);

        if(!event) {
            throw new NotFoundException();
        }

        return event;
    }

    @Post()
    // buat validaiton groups nya disini
    async create(@Body() input: CreateEventDto) {
        return await this.repository.save({
            ...input,
            when: new Date(input.when),
        });
    }

    @Patch(':id')
    async update(
        @Param('id') id,
        @Body() input: UpdateEventDto) {
        const event = await this.repository.findOne(id);

        if(!event) {
            throw new NotFoundException();
        }

        return await this.repository.save({
            // copy semua property dari index yang didapet
            ...event,
            // ambil property yang diupdate, karena optional
            ...input,
            // cek apakah input provided, jika iya crete new Date object
            when: input.when ? new Date(input.when) : event.when
        });
    }

    @Delete(':id')
    // set http code
    @HttpCode(204)
    async remove(@Param('id') id) {
        // remove 1 single element
        const event = await this.repository.findOne(id);
        
        if(!event) {
            throw new NotFoundException();
        }

        await this.repository.remove(event);
    }
}