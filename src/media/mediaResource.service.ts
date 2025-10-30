import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaResourceType } from './schema/MediaResource.schema';
import {
  QueryMediaResourceDetailDto,
  QueryMediaResourceListDto,
} from './mediaResource.type';
import { MediaAlbumType } from './schema/MediaAlbum.schema';

@Injectable()
export class MediaResourceService {
  constructor(
    @InjectModel('MediaResource')
    private readonly mediaAlbumModel: Model<MediaAlbumType>,
    private readonly mediaResourceModel: Model<MediaResourceType>,
  ) {}

  // 分页查询资源列表
  async findAll(query: QueryMediaResourceListDto) {
    return query;
  }

  // 根据ID && 类型查询资源详情
  async findByAlbum(query: QueryMediaResourceDetailDto) {
    const resourceList = await this.mediaAlbumModel
      .find({ album: query.id, type: query.type })
      .exec();
    if (!resourceList?.length) {
      throw new NotFoundException(
        `MediaAlbum with ID ${query.id} has not resource`,
      );
    }
    return resourceList;
  }
}
