import { Injectable } from '@nestjs/common';
import { AddLogProps } from './monitor.type';
import { pageProps } from 'src/core/type/page';

@Injectable()
export class MonitorService {
  async addData(data: AddLogProps) {
    // 处理数据
    // 处理写入逻辑
    console.log(data);
  }

  async getDataList(query: pageProps) {
    // 查询数据逻辑
    console.log(query);
  }
}
