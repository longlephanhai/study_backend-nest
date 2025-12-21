import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiAssistantService {
  private genAI: GoogleGenerativeAI;
  private genAiProModel: any;

  constructor(
    private configService: ConfigService,
  ) {
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('API_GEMINI_KEY')!);
    this.genAiProModel = this.genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  }

  async explainSentence(sentence: string) {
    const prompt = `
Bạn là một trợ lý học tiếng Anh chuyên nghiệp, giúp học viên luyện thi TOEIC/IELTS.
Phân tích câu sau: "${sentence}"

Yêu cầu:
1. Giải thích nghĩa câu bằng tiếng Việt.
2. Chỉ ra các điểm ngữ pháp quan trọng trong câu.
3. Giải thích các từ vựng khó.
4. Nếu câu là dạng trắc nghiệm, phân tích lý do chọn đáp án đúng, đồng thời giải thích tại sao các đáp án khác sai.
5. Trả về kết quả dưới dạng JSON với cấu trúc:

[
  {
    "original": "câu gốc",
    "explanation": "giải thích bằng tiếng Việt",
    "grammar_notes": ["ghi chú ngữ pháp 1", "ghi chú ngữ pháp 2", ...],
    "vocabulary": [
      {"word": "từ khó", "meaning": "nghĩa từ khó", "example": "ví dụ câu"}
    ],
    "answer_analysis": [
      {"option": "A", "reason": "tại sao sai/đúng"},
      {"option": "B", "reason": "tại sao sai/đúng"},
      {"option": "C", "reason": "tại sao sai/đúng"},
      {"option": "D", "reason": "tại sao sai/đúng"}
    ]
  }
]

Chỉ trả về JSON, không thêm text ngoài JSON.
`;


    const result = await this.genAiProModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const rawText = result.response.text();

    const jsonStart = rawText.indexOf("[");
    const jsonEnd = rawText.lastIndexOf("]");
    const jsonString =
      jsonStart !== -1 && jsonEnd !== -1
        ? rawText.slice(jsonStart, jsonEnd + 1)
        : rawText;

    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn("AI output invalid JSON:", rawText);
      return [];
    }
  }


}
