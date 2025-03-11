import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { DeviceInfo, LocationInfo } from '../monitor.type';
import { MonitorEvents } from './MonitorEvents.entity';
import { MonitorUser } from './MonitorUser.entity';

@Entity('sessions')
export class MonitorSession {
  @PrimaryGeneratedColumn()
  sessionId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  platform: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  timezone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language: string;

  @Column({ type: 'jsonb' })
  deviceInfo: DeviceInfo;

  @Column({ type: 'jsonb' })
  locationInfo: LocationInfo;

  @OneToMany(() => MonitorEvents, (event: any) => event.session)
  events: MonitorEvents[];

  @ManyToOne(() => MonitorUser, (user: any) => user.sessions)
  user: MonitorUser;
}
