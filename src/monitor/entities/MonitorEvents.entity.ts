import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { EventData } from '../monitor.type';
import { MonitorUser } from './MonitorUser.entity';
import { MonitorSession } from './MonitorSession.entity';

@Entity('events')
@Index(['userId', 'createTime'])
@Index(['eventType', 'createTime'])
export class MonitorEvents {
  @PrimaryGeneratedColumn('uuid')
  eventId: number;

  @ManyToOne(() => MonitorSession, (session: any) => session.events)
  session: MonitorSession;

  @ManyToOne(() => MonitorUser, (user: any) => user.sessions)
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  eventType: string;

  @Column({ type: 'varchar', length: 50 })
  eventName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referrerUrl: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    precision: 3,
  })
  createTime: Date;

  @Column({ type: 'json' })
  eventData: EventData;

  // 错误信息
  @Column({ type: 'varchar', nullable: true })
  errorMessage: string;

  @Column({ type: 'text', nullable: true })
  errorStack: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  errorCode: string;

  // 性能相关
  @Column({ type: 'timestamp', nullable: true })
  loadTime: Date;

  @Column({ type: 'int', nullable: true })
  resourceSize: number;
}
