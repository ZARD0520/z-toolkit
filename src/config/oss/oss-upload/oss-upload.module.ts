import { Module } from '@nestjs/common';
import { OssUploadController } from './oss-upload.controller';
import { OssUploadService } from './oss-upload.service';

@Module({
  controllers: [OssUploadController],
  providers: [OssUploadService],
})
export class OssUploadModule {}
