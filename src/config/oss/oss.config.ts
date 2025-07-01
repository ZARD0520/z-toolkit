import OSS from 'ali-oss';

export const ossClient: any = new OSS({
  region: process.env.oss_region, // OSS 区域
  accessKeyId: process.env.oss_accessKeyId || '', // 阿里云 AccessKey ID
  accessKeySecret: process.env.oss_accessKeySecret || '', // 阿里云 AccessKey Secret
  bucket: process.env.oss_bucket, // OSS 存储桶名称
});
