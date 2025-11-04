export interface pageProps {
  current: number;
  limit: number;
  total: number;
}

export interface PaginationParams {
  current: number;
  limit: number;
  [key: string]: any;
}
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    current: number;
    limit: number;
    total: number;
    pages: number;
  };
}
export interface PaginationOptions {
  sort?: any; // 排序条件
  populate?: string | any[]; // 关联查询
  select?: string | any; // 字段选择
  lean?: boolean; // 是否返回纯JS对象
}
