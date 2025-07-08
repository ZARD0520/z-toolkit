import { Test } from '@nestjs/testing';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MonitorTaskService } from './monitorTask.service';

describe('MonitorTaskService', () => {
  let processor: MonitorTaskService;
  let scheduler: SchedulerRegistry;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MonitorTaskService],
    }).compile();

    processor = module.get<MonitorTaskService>(MonitorTaskService);
    scheduler = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  it('应该注册10秒间隔的定时任务', () => {
    const job = scheduler.getCronJob('handleCron');
    expect(job).toBeDefined();
    expect(job.cronTime.toString()).toBe('*/10 * * * * *');
  });

  it('手动调用时应执行定时任务逻辑', async () => {
    const spy = jest.spyOn(processor, 'handleCron');
    await processor.handleCron();
    expect(spy).toHaveBeenCalled();
    expect(await processor.handleCron()).toBe(true); // 验证返回值
  });
});
