import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';

@Module({
  controllers: [McpController],
  providers: [McpService],
})
export class McpModule {}
