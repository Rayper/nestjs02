import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from './teacher.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(
    () => Teacher, (teacher) => teacher.subjects, { cascade: true }
  )
  // kalo mau custom nama table untuk join
  // @JoinTable({name: 'test_join_table_name' })
  // bisa lakuin config yang sama dengan inverseJoinColumn
  // @JoinTable({
  //   joinColumn: {
  //     name: 'subjectId',
  //     referencedColumnName: 'id'
  //   }, inverseJoinColumn: {

  //   }
  // })
  @JoinTable()
  teachers: Teacher[];
}