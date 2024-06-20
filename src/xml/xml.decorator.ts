import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

export const XML = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    return new Promise((resolve, reject) => {
      const req = ctx.switchToHttp().getRequest();
      const buffer: ArrayBuffer[] = [];
      req.on('data', (content: ArrayBuffer) => {
        buffer.push(content);
      });

      req.on('end', () => {
        if (!XMLValidator.validate(buffer.toString()))
          return reject(new Error('Invalid XML'));
        const xmlParser = new XMLParser();
        const { xml } = xmlParser.parse(buffer.toString());
        resolve(xml);
      });
    });
  },
);
