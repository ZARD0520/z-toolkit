import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaResourceType } from './schema/MediaResource.schema';
import {
  QueryMediaResourceDetailDto,
  QueryMediaResourceListDto,
} from './mediaResource.type';
import { MediaAlbumType } from './schema/MediaAlbum.schema';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class MediaResourceService {
  constructor(
    @InjectModel('MediaAlbum')
    private readonly mediaAlbumModel: Model<MediaAlbumType>,
    @InjectModel('MediaResource')
    private readonly mediaResourceModel: Model<MediaResourceType>,
    private paginationService: PaginationService,
  ) {}

  async onModuleInit() {
    // 当NestJS模块初始化完成后，同步索引
    try {
      await this.mediaAlbumModel.syncIndexes();
      await this.mediaResourceModel.syncIndexes();
      console.log(
        'Indexes for mediaAlbumModel、mediaResourceModel synced successfully.',
      );
    } catch (error) {
      console.error(
        'Failed to sync indexes for mediaAlbumModel、mediaResourceModel:',
        error,
      );
    }
  }

  // 分页查询资源列表
  async findAll(query: QueryMediaResourceListDto) {
    const { current, limit, type, albumName } = query;

    return this.paginationService.paginate(this.mediaAlbumModel, {
      current,
      limit,
      type,
      albumName,
    });
  }

  // 根据ID && 类型查询资源详情
  async findByAlbum(query: QueryMediaResourceDetailDto) {
    const resourceList = await this.mediaResourceModel
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
