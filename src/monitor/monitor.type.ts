export interface Log {
  userName: string;
  type: string;
  typeValue?: string;
  typeText?: string;
  level: string;
  levelValue?: string;
  levelText?: string;
  target?: string;
  pageTitle?: string;
  customName?: string;
  data: string;
  info: string;
  userAgent?: string;
  time?: number;
  createTime?: string;
}

export interface AddLogProps {
  data: Array<Log>;
}

export interface EventData {
  // 定义具体的字段
  [key: string]: any;
}

export interface DeviceInfo {
  // 定义具体的字段
  [key: string]: any;
}

export interface BrowserInfo {
  // 定义具体的字段
  [key: string]: any;
}

export interface PerformanceInfo {
  // 定义具体的字段
  [key: string]: any;
}
