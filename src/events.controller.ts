import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CreateEventDto } from "./create-event.dto";
import { Event } from "./event.entity";
import { UpdateEventDto } from "./update-event.dto";

@Controller('/events')
export class EventsController {
    private events: Event[] = [];

    @Get()
    findAll() {
        return this.events;
    }

    @Get(':id')
    // kalau ga dipassing namanya akan membentuk sebuah object
    findOne(@Param('id') id) {
        const event = this.events.find(
            event => event.id === parseInt(id)
        );
        
        return event;
    }

    @Post()
    create(@Body() input: CreateEventDto) {
        const event = {
            ...input,
            when: new Date(input.when),
            // dapetin next available id
            id: this.events.length + 1
        };
        this.events.push(event);
        return event;
    }

    @Patch(':id')
    update(@Param('id') id, @Body() input: UpdateEventDto) {
        const index = this.events.findIndex(
            event => event.id === parseInt(id)
        );

        this.events[index] = {
            // copy semua property dari index yang didapet
            ...this.events[index],
            // ambil property yang diupdate, karena optional
            ...input,
            // cek apakah input provided, jika iya crete new Date object
            when: input.when ? new Date(input.when) : this.events[index].when
        }

        return this.events[index];
    }

    @Delete(':id')
    // set http code
    @HttpCode(204)
    remove(@Param('id') id) {
        // remove 1 single element
        this.events = this.events.filter(
            event => event.id !== parseInt(id)
        );
    }
}