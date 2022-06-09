import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with ID', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with ID', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with ID', this.id);
  }
}
