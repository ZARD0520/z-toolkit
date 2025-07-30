import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { buildPrompt } from '../utils/mcp';

@Injectable()
export class McpService {
  private examples: any[];
  constructor(/* aiClient */) {
    this.loadExamples();
  }

  private loadExamples() {
    const examplesDir = path.join(__dirname, '../examples');
    this.examples = fs.readdirSync(examplesDir).map((file) => {
      return JSON.parse(fs.readFileSync(path.join(examplesDir, file), 'utf-8'));
    });
  }

  async generateDSL(input: string) {
    const prompt = buildPrompt(input, this.examples);
    const dsl = { prompt }; // TODO: ai.generateDSL
    // const {isValid,errors} = validateDSL
    // if (!isValid) {
    //   throw new Error(`Invalid DSL: ${errors.join(', ')}`);
    // }
    return dsl;
  }
}
