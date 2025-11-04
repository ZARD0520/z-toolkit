import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  MUSIC = 'music',
}
export class QueryMediaResourceListDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  current: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Min(10) // 限制最小每页数量
  @Max(100) // 限制最大每页数量
  limit: number = 10;

  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @IsOptional()
  @IsString()
  albumName?: string;
}

export class QueryMediaResourceDetailDto {
  type: MediaType;
  id?: number;
  name?: string;
}
