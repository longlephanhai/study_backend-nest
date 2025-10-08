import { BadRequestException, Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ExamResult } from 'src/exam-result/schema/exam-result.schema';
import { Model } from 'mongoose';
import { Question } from 'src/question/schema/question.schema';

@Injectable()
export class Part5MistakesService {
  private genAI: GoogleGenerativeAI;
  private genAiProModel: any;

  constructor(
    @InjectModel(ExamResult.name) private examResultModel: Model<ExamResult>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
    private configService: ConfigService,
  ) {
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('API_GEMINI_KEY')!);
    this.genAiProModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  }

  async generatePart5Mistakes(numQuestions: number, user: IUser) {
    const examResults = await this.examResultModel.find({ userId: user._id }).sort({ createdAt: -1 });
    if (!examResults || examResults.length === 0) {
      throw new BadRequestException('No exam result found for the user');
    }
    const wrongAnswerIds = examResults.map(result => result.wrongAnswer).flat();
    const wrongQuestions = await this.questionModel.find({
      _id: { $in: wrongAnswerIds }
    });
    const questions101to130 = wrongQuestions.filter(q => q.numberQuestion >= 101 && q.numberQuestion <= 130);
    const categoryMistakeCount: { [key: string]: number } = {};
    questions101to130.forEach(q => {
      if (q.category) {
        categoryMistakeCount[q.category] = (categoryMistakeCount[q.category] || 0) + 1;
      }
    });
    // --- Gọi Gemini ---


    const prompt = `
  Bạn là một chuyên gia TOEIC. 
  Hãy tạo ra ${numQuestions} câu hỏi TOEIC Part 5 (dạng điền vào chỗ trống) phù hợp với các chủ điểm mà người học hay sai dưới đây:
  ${JSON.stringify(categoryMistakeCount, null, 2)}
  Yêu cầu:
  - Mỗi câu có format JSON: 
    {
      "question": "Câu hỏi có một chỗ trống ___",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Giải thích ngắn gọn lý do tại sao đáp án đúng",
      "category": "Tên chủ điểm"
    }
  - Nội dung tiếng Anh, trình độ TOEIC Part 5.
  - Không cần lời chào, chỉ trả về JSON array.
  - Đảm bảo JSON hợp lệ.
  - Đảm bảo đủ token không để tràn bộ nhớ.
  `;

    const result = await this.genAiProModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1500,
      },
    });

    const rawText = result.response.text();

    const jsonStart = rawText.indexOf("[");
    const jsonEnd = rawText.lastIndexOf("]");
    const jsonString =
      jsonStart !== -1 && jsonEnd !== -1
        ? rawText.slice(jsonStart, jsonEnd + 1)
        : rawText;
    try {
      const questions = JSON.parse(jsonString);
      return questions;
    } catch (error) {
      console.warn("⚠️ AI output not valid JSON, returning empty array.");
      return [];
    }
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