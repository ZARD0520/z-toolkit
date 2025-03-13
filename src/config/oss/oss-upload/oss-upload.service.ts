import { Injectable } from '@nestjs/common';
import { ossClient } from '../oss.config';
import * as crypto from 'crypto';

@Injectable()
export class OssUploadService {
  // 生成上传凭证
  async generateUploadToken(filename: string) {
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 小时后过期
    const policy = {
      expiration: expiration.toISOString(),
      conditions: [
        ['content-length-range', 0, 104857600], // 文件大小限制（100MB）
        ['starts-with', '$key', filename], // 文件名限制
      ],
    };

    const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');
    const signature = crypto
      .createHmac('sha1', ossClient.options.accessKeySecret)
      .update(policyBase64)
      .digest('base64');

    return {
      accessKeyId: ossClient.options.accessKeyId,
      policy: policyBase64,
      signature,
      bucket: ossClient.options.bucket,
      endpoint: `https://${ossClient.options.bucket}.${ossClient.options.region}.aliyuncs.com`,
      filename,
    };
  }

  // 验证 OSS 回调
  verifyCallback(authorization: string, filename: string, body: any) {
    const publicKey = 'your-public-key'; // OSS 回调的公钥
    const authStr = Buffer.from(authorization, 'base64').toString('utf-8');
    const [pubKeyUrl, signature] = authStr.split(':');

    if (pubKeyUrl !== publicKey) {
      return false;
    }

    const verify = crypto.createVerify('sha1');
    verify.update(JSON.stringify(body));
    return verify.verify(publicKey, signature, 'base64');
  }

  // 保存文件元数据
  async saveFileMetadata(filename: string, body: any) {
    // 将文件信息保存到数据库
    const fileMetadata = {
      filename,
      size: body.size,
      url: body.url,
      createdAt: new Date(),
    };
    // TODO: 保存到数据库
    return fileMetadata;
  }
}
