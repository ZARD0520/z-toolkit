import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AttributesInfo } from '../monitor.type';
import { MonitorSession } from './MonitorSession.entity';

@Entity('users')
export class MonitorUser {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  lastActiveTime: Date;

  @Column({ type: 'json', nullable: true })
  attributes: AttributesInfo;

  @OneToMany(() => MonitorSession, (session: any) => session.user)
  sessions: MonitorSession[];
}
