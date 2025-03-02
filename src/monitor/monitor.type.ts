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
