import { BadRequestException, Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ExamResult } from 'src/exam-result/schema/exam-result.schema';
import { Model } from 'mongoose';
import { Question } from 'src/question/schema/question.schema';
import { Part5Service } from 'src/part5/part5.service';
import { Part5 } from 'src/part5/schema/part5.schema';

@Injectable()
export class Part5MistakesService {
  private genAI: GoogleGenerativeAI;
  private genAiProModel: any;

  constructor(
    @InjectModel(ExamResult.name) private examResultModel: Model<ExamResult>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Part5.name) private part5Model: Model<Part5>,
    private configService: ConfigService,
    private readonly part5Service: Part5Service,
  ) {
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('API_GEMINI_KEY')!);
    this.genAiProModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  }

  async generatePart5Mistakes(numQuestions: number, user: IUser) {
    const examResults = await this.examResultModel
      .find({ userId: user._id })
      .sort({ createdAt: -1 });

    if (!examResults || examResults.length === 0) {
      throw new BadRequestException('No exam result found for the user');
    }

    const wrongAnswerIds = examResults.map(r => r.wrongAnswer).flat();
    const wrongQuestions = await this.questionModel.find({
      _id: { $in: wrongAnswerIds }
    });

    const questions101to130 = wrongQuestions.filter(
      q => q.numberQuestion >= 101 && q.numberQuestion <= 130
    );

    const categoryMistakeCount: Record<string, number> = {};
    questions101to130.forEach(q => {
      if (q.category) {
        categoryMistakeCount[q.category] =
          (categoryMistakeCount[q.category] || 0) + 1;
      }
    });

    const questionsPart5 = await this.part5Service.findAll();

    const prompt = `
Bạn là một chuyên gia TOEIC.

Dưới đây là thống kê số lỗi của người học theo từng chủ điểm:
${JSON.stringify(categoryMistakeCount, null, 2)}

Và đây là danh sách toàn bộ câu hỏi Part 5 trong cơ sở dữ liệu (gồm id và category):
${JSON.stringify(
      questionsPart5.map(q => ({ id: q._id, category: q.category })),
      null,
      2
    )}

Hãy CHỌN ra đúng ${numQuestions} câu hỏi phù hợp nhất để người học ôn tập lại.
Yêu cầu:
- Ưu tiên các category mà người học sai nhiều nhất.
- Phân bổ theo tỉ lệ lỗi.
- Nếu category không đủ câu thì lấy ở category sai nhiều tiếp theo.
- Chỉ TRẢ VỀ một mảng JSON **chỉ gồm id**, ví dụ:
[
  { "id": "650fa3..." },
  { "id": "6510bc..." }
]
- Không trả về nội dung câu hỏi, không giải thích, không thêm text khác.
- Chỉ trả về JSON array hợp lệ.
`;

    const result = await this.genAiProModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1200,
      },
    });

    const rawText = result.response.text();


    const jsonStart = rawText.indexOf("[");
    const jsonEnd = rawText.lastIndexOf("]");
    const jsonString =
      jsonStart !== -1 && jsonEnd !== -1
        ? rawText.slice(jsonStart, jsonEnd + 1)
        : rawText;

    let selectedIds: string[] = [];

    try {
      const parsed = JSON.parse(jsonString);
      selectedIds = parsed.map((item: any) => item.id);
    } catch (e) {
      console.warn("AI output invalid JSON:", rawText);
      return [];
    }

    const finalQuestions = await this.part5Model.find({
      _id: { $in: selectedIds }
    });

    return finalQuestions;
  }


  async getAllMistakes(user: IUser) {
    const examResults = await this.examResultModel.find({ userId: user._id }).sort({ createdAt: -1 });
    if (!examResults || examResults.length === 0) {
      throw new BadRequestException('No exam result found for the user');
    }
    const wrongAnswerIds = examResults.map(result => result.wrongAnswer).flat();
    const wrongQuestions = await this.questionModel.find({
      _id: { $in: wrongAnswerIds }
    });
    // part 1
    const questions1to6 = wrongQuestions.filter(q => q.numberQuestion >= 1 && q.numberQuestion <= 6);
    const categoryMistakeCountPart1: { [key: string]: number } = {};
    questions1to6.forEach(q => {
      if (q.category) {
        categoryMistakeCountPart1[q.category] = (categoryMistakeCountPart1[q.category] || 0) + 1;
      }
    });
    // part 2
    const questions7to31 = wrongQuestions.filter(q => q.numberQuestion >= 7 && q.numberQuestion <= 31);
    const categoryMistakeCountPart2: { [key: string]: number } = {};
    questions7to31.forEach(q => {
      if (q.category) {
        categoryMistakeCountPart2[q.category] = (categoryMistakeCountPart2[q.category] || 0) + 1;
      }
    });
    // part 3
    const questions32to70 = wrongQuestions.filter(q => q.numberQuestion >= 32 && q.numberQuestion <= 70);
    const categoryMistakeCountPart3: { [key: string]: number } = {};
    questions32to70.forEach(q => {
      if (q.category) {
        categoryMistakeCountPart3[q.category] = (categoryMistakeCountPart3[q.category] || 0) + 1;
      }
    });
    // part 4
    const questions71to100 = wrongQuestions.filter(q => q.numberQuestion >= 71 && q.numberQuestion <= 100);
    const categoryMistakeCountPart4: { [key: string]: number } = {};
    questions71to100.forEach(q => {
      if (q.category) {
        categoryMistakeCountPart4[q.category] = (categoryMistakeCountPart4[q.category] || 0) + 1;
      }
    });
    // part 5
    const questions101to130 = wrongQuestions.filter(q => q.numberQuestion >= 101 && q.numberQuestion <= 130);
    const categoryMistakeCountPart5: { [key: string]: number } = {};
    questions101to130.forEach(q => {
      if (q.category) {
        categoryMistakeCountPart5[q.category] = (categoryMistakeCountPart5[q.category] || 0) + 1;
      }
    });
    // part 6
    const questions131to146 = wrongQuestions.filter(q => q.numberQuestion >= 131 && q.numberQuestion <= 146);
    const categoryMistakeCountPart6: { [key: string]: number } = {};
    questions131to146.forEach(q => {
      if (q.category) {
        categoryMistakeCountPart6[q.category] = (categoryMistakeCountPart6[q.category] || 0) + 1;
      }
    });
    // part 7
    const questions147to200 = wrongQuestions.filter(q => q.numberQuestion >= 147 && q.numberQuestion <= 200);
    const categoryMistakeCountPart7: { [key: string]: number } = {};
    questions147to200.forEach(q => {
      if (q.category) {
        categoryMistakeCountPart7[q.category] = (categoryMistakeCountPart7[q.category] || 0) + 1;
      }
    });
    return [
      { part1: categoryMistakeCountPart1 },
      { part2: categoryMistakeCountPart2 },
      { part3: categoryMistakeCountPart3 },
      { part4: categoryMistakeCountPart4 },
      { part5: categoryMistakeCountPart5 },
      { part6: categoryMistakeCountPart6 },
      { part7: categoryMistakeCountPart7 },
    ]
  }
}