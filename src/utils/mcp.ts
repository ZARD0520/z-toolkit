export const buildPrompt = (userInput: string, examples: any[]) => {
  const matchedExamples = examples
    .filter((e) =>
      e.input.toLowerCase().includes(userInput.toLowerCase().split(' ')[0]),
    )
    .slice(0, 3);

  let prompt = `你是一个低代码活动DSL生成器，请根据以下示例生成JSON格式的DSL：\n\n`;
  matchedExamples.forEach((e) => {
    prompt += `输入：${e.input}\n输出：${JSON.stringify(e.output, null, 2)}\n\n`;
  });
  prompt += `输入：${userInput}\n输出：`;
  return prompt;
};
