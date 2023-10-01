import { Report } from 'src/reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  BaseEntity,
  OneToMany,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({default: false})
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]

  @AfterInsert()
  logInsert() {
    console.log('User inserted with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User updated with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('User removed with id', this.id);
  }
}
