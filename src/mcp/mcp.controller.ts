import { Body, Controller, Post } from '@nestjs/common';
import { McpService } from './mcp.service';
import { GenerateDSLDto } from './dto/mcp.dto';

@Controller('mcp')
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  @Post('generate')
  async generateDSL(@Body() dto: GenerateDSLDto) {
    return this.mcpService.generateDSL(dto.userInput);
  }
}
