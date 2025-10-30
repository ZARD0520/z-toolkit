import { Controller, Get, Query } from '@nestjs/common';
import { MediaResourceService } from './mediaResource.service';
import {
  QueryMediaResourceDetailDto,
  QueryMediaResourceListDto,
} from './mediaResource.type';

@Controller('media-resources')
export class MediaResourceController {
  constructor(private readonly mediaResourceService: MediaResourceService) {}

  // 获取资源列表-分页
  @Get('/list')
  async getList(@Query() query: QueryMediaResourceListDto) {
    return this.mediaResourceService.findAll(query);
  }

  // 获取资源详情
  @Get('/detail')
  async findByAlbum(@Query() query: QueryMediaResourceDetailDto) {
    return this.mediaResourceService.findByAlbum(query);
  }
}
