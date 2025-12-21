import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class WritingAiService {
  private genAI: GoogleGenerativeAI;
  private genAiProModel: any;

  constructor(private configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('API_GEMINI_KEY')!);
    this.genAiProModel = this.genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  }

  async generateText(promptDto: PromptDto): Promise<any> {
    const { title, description, content, level, minWords, maxWords } = promptDto;

    if (!content || content.trim() === "") {
      throw new Error("Content cannot be empty");
    }

    const instruction = `
You are an advanced English writing evaluator for TOEIC and business contexts.

Evaluate the following essay carefully and return detailed feedback.

Essay metadata:
- Title: ${title}
- Description: ${description}
- Level: ${level || "Unknown"}
- Expected word range: ${minWords || "?"}–${maxWords || "?"}

Essay content:
"""${content}"""

Return the result strictly in JSON format with this structure:
{
  "overallFeedback": "string",
  "grammarErrors": [
    { "original": "string", "correction": "string", "explanation": "string" }
  ],
  "vocabularySuggestions": [
    { "word": "string", "suggestion": "string", "reason": "string" }
  ],
  "structureFeedback": "string",
  "score": {
    "grammar": number,
    "vocabulary": number,
    "coherence": number,
    "taskResponse": number,
    "overall": number
  },
  "improvedVersion": "string"
}

Guidelines:
- Be concise but precise.
- Always include at least 1 example for grammar and vocabulary feedback.
- If the essay is excellent, still give at least one suggestion for improvement.
`;

    const result = await this.genAiProModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: instruction }],
        },
      ],
    });

    const rawText = result.response.text();

    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");
    const jsonString =
      jsonStart !== -1 && jsonEnd !== -1
        ? rawText.slice(jsonStart, jsonEnd + 1)
        : rawText;

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn("AI output not valid JSON, returning raw text.");
      return { overallFeedback: rawText };
    }
  }




  async generateImage(prompt: string, imageBase64: string): Promise<string> {
    if (!prompt || !imageBase64) {
      throw new Error('Prompt and imageBase64 are required');
    }

    // Nếu có tiền tố "data:image/png;base64," thì cắt đi
    const base64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const result = await this.genAiProModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64,
              },
            },
          ],
        },
      ],
    });

    // Phần response trả về có thể nằm trong `result.response`
    const response = await result.response;
    const text = response.text();
    return text;
  }

}
