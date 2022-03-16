import { Controller, Post } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from "src/auth/profile.entity";
import { User } from "src/auth/user.entity";
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Controller('school')
export class TrainingController {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) { }

  @Post('/create')
  public async savingRelation() {
    // const subject = new Subject();
    // subject.name = 'Math';

    const subject = await this.subjectRepository.findOne(3);
    // await this.subjectRepository.save(subject);

    // const teacher1 = new Teacher();
    // teacher1.name = 'John Doe';

    // const teacher2 = new Teacher();
    // teacher2.name = 'Harry Doe';

    // subject.teachers = [teacher1, teacher2];

    // await this.teacherRepository.save([teacher1, teacher2]);

    // How to use One to One
    const user = new User();
    const profile = new Profile();

    user.profile = profile;
    user.profile = null;
    // Save the user here


    const teacher1 = await this.teacherRepository.findOne(3);
    const teacher2 = await this.teacherRepository.findOne(4);

    return await this.subjectRepository
      .createQueryBuilder()
      // subject class, teachers relation-nya
      .relation(Subject, 'teachers')
      // variable subject yang findOne(3)
      .of(subject)
      // passing ke array of object yang ditargetin
      .add([teacher1, teacher2]);
  }

  @Post('/remove')
  public async removingRelation() {
    // const subject = await this.subjectRepository.findOne(1, {relations: ['teachers']});

    // subject.teachers = subject.teachers.filter(teacher => teacher.id !== 2);

    // await this.subjectRepository.save(subject);
    // s sebagai alias dari subject
    await this.subjectRepository.createQueryBuilder('s')
      .update()
      // ketika hit endpoint remove maka name nya menjad confidential
      .set({ name: "Confidential" })
      .execute();
  }
}