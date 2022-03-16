import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppDummy } from './app.dummy';
import { AppJapanService } from './app.japan.service';
import { AppService } from './app.service';
import { Attendee } from './events/attendee.entity';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { Event } from './events/event.entity';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load orm config nya
      load: [ormConfig],
      expandVariables: true
    }),
    // setting async
    TypeOrmModule.forRootAsync({
      // cek apakah production atau dev
      useFactory: process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd
    }),
    // ConfigModule.forRoot(),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: Number(process.env.DB_PORT),
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   entities: [Event, Attendee],
    //   synchronize: true,
    // }),
    TypeOrmModule.forFeature([Event, Attendee]),
    EventsModule
],
  controllers: [AppController],
  providers: [{
    provide: AppService,
    useClass: AppJapanService,
  }, {
    provide: 'APP_NAME',
    useValue: 'Nest Events Backend!'
  }, {
    provide: 'MESSAGE',
    inject: [AppDummy],
    useFactory: (app) => `${app.dummy()} Factory!`
  }, AppDummy],
})
export class AppModule {}
