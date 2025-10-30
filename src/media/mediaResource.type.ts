export class QueryMediaResourceListDto {
  page?: number = 1;
  limit?: number = 10;
  type?: 'image' | 'video' | 'music';
  albumName?: string;
}

export class QueryMediaResourceDetailDto {
  type: 'image' | 'video' | 'music';
  id?: number;
  name?: string;
}
