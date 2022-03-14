import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";

@Controller('/events')
export class EventsController {

    @Get()
    findAll() {
        return [
            {id: 1, name: "First Event"},
            {id: 2, name: "Second Event"},
        ];
    }

    @Get(':id')
    // kalau ga dipassing namanya akan membentuk sebuah object
    findOne(@Param('id') id) {
        return {id: 1, name: "First Event"};
    }

    @Post()
    create(@Body() input) {
        return input;
    }

    @Patch(':id')
    update(@Param('id') id, @Body() input) {
        return input;
    }

    @Delete(':id')
    // set http code
    @HttpCode(204)
    remove(@Param('id') id) {

    }
}