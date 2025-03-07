import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LogCount {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userName: string
}