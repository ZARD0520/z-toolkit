import { Injectable } from '@nestjs/common';
import {
  PaginationOptions,
  PaginationParams,
  PaginationResult,
} from '../types/pagination.type';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class PaginationService {
  async paginate<T>(
    model: Model<T>,
    params: PaginationParams,
    options: PaginationOptions = {},
  ): Promise<PaginationResult<T>> {
    params.current = Number(params.current);
    params.limit = Number(params.limit);

    const { limit, current, ...filters } = params;
    const skip = (current - 1) * limit;

    const filter = this.buildFilter(filters);

    try {
      let query = model.find(filter);

      query = this.applyQueryOptions(query, options);

      const [data, totalItems] = await Promise.all([
        query.skip(skip).limit(limit).exec(),
        model.countDocuments(filter).exec(),
      ]);

      // 计算分页信息
      const pages = Math.ceil(totalItems / limit);

      return {
        data,
        pagination: {
          current,
          limit,
          pages,
          total: totalItems,
        },
      };
    } catch (error) {
      throw new Error(`分页查询失败: ${error.message}`);
    }
  }

  private buildFilter<T>(filters: Record<string, any>): FilterQuery<T> {
    const filter: Record<string, any> = {};

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value !== undefined && value !== null && value !== '') {
        // 处理特殊查询条件
        if (typeof value === 'string' && value.includes('*')) {
          // 模糊搜索：name=*john*
          filter[key] = {
            $regex: value.replace(/\*/g, '.*'),
            $options: 'i',
          };
        } else if (typeof value === 'object') {
          // 直接使用对象条件：{ $gte: 100 }
          filter[key] = value;
        } else {
          // 精确匹配
          filter[key] = value;
        }
      }
    });

    return filter;
  }

  private applyQueryOptions(query: any, options: PaginationOptions) {
    const { sort, populate, select, lean } = options;

    // 排序
    if (sort) {
      query = query.sort(sort);
    } else {
      query = query.sort({ createdAt: -1 }); // 默认排序
    }

    // 字段选择
    if (select) {
      query = query.select(select);
    }

    // 关联查询
    if (populate) {
      query = query.populate(populate);
    }

    // 返回纯JS对象
    if (lean) {
      query = query.lean();
    }

    return query;
  }
}
