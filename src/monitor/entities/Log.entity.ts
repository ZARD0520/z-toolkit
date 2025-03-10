import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  BrowserInfo,
  DeviceInfo,
  EventData,
  PerformanceInfo,
} from '../monitor.type';

@Entity()
export class Log {
  // ID
  @PrimaryGeneratedColumn()
  id: number;

  // 埋点基础信息
  @Column({ type: 'varchar', length: 50 })
  eventType: string;

  @Column({ type: 'text' })
  eventValue: string;

  @Column({ type: 'json' })
  eventData: EventData;

  @Column({ type: 'varchar', length: 50, unique: true })
  eventId: string; // 根据此id判断用户故事

  @Column({ type: 'varchar', length: 50, nullable: true })
  platform: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  // 用户相关信息
  @Column({ type: 'varchar', length: 50 })
  userName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ip: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  timezone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language: string;

  @Column({ type: 'json', nullable: true })
  deviceInfo: DeviceInfo;

  @Column({ type: 'json', nullable: true })
  browserInfo: BrowserInfo;

  @Column({ type: 'json', nullable: true })
  performanceInfo: PerformanceInfo;

  // 错误信息
  @Column({ type: 'varchar', nullable: true })
  errorMessage: string;

  @Column({ type: 'text', nullable: true })
  errorStack: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  errorCode: string;
}
