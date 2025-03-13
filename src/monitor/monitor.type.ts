import { LogDTO } from './dto/monitor.dto';

export interface AddLogProps {
  data: Array<LogDTO>;
}

export interface EventData {
  // 定义具体的字段
  [key: string]: any;
}

export interface DeviceInfo {
  type: string;
  os: string;
  browser: string;
  resolution: string;
}

export interface LocationInfo {
  country: string;
  province: string;
  city: string;
  ip: string;
}

export interface PerformanceInfo {
  // 定义具体的字段
  [key: string]: any;
}

export interface AttributesInfo {
  // 定义具体的字段
  [key: string]: any;
}
