import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

export const XML = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    return new Promise((resolve, reject) => {
      const req = ctx.switchToHttp().getRequest();
      req.on('data', (content: ArrayBuffer) => {
        if (!XMLValidator.validate(content.toString()))
          return reject(new Error('Invalid XML'));
        const xmlParser = new XMLParser();
        const { xml } = xmlParser.parse(content.toString());
        resolve(xml);
      });
    });
  },
);
