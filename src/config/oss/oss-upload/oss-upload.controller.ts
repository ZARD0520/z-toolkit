import {
  Controller,
  Post,
  Body,
  Query,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OssUploadService } from './oss-upload.service';

@Controller('oss')
export class OssUploadController {
  constructor(private readonly ossUploadService: OssUploadService) {}

  // 生成上传凭证
  @Post('upload-token')
  async generateUploadToken(@Body('filename') filename: string) {
    if (!filename) {
      throw new HttpException('文件名不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.ossUploadService.generateUploadToken(filename);
  }

  // OSS 回调验证
  @Post('callback')
  async handleCallback(
    @Headers('authorization') authorization: string,
    @Query('filename') filename: string,
    @Body() body: any,
  ) {
    const isValid = this.ossUploadService.verifyCallback(
      authorization,
      filename,
      body,
    );
    if (!isValid) {
      throw new HttpException('回调验证失败', HttpStatus.FORBIDDEN);
    }
    return this.ossUploadService.saveFileMetadata(filename, body);
  }
}
