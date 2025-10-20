import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Grammar } from './schema/grammar.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GrammarsService {
  private genAI: GoogleGenerativeAI;
  private genAiProModel: any;

  constructor(
    @InjectModel(Grammar.name) private grammarModel: Model<Grammar>,
    private configService: ConfigService
  ) {
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('API_GEMINI_KEY')!);
    this.genAiProModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  }
  create(createGrammarDto: CreateGrammarDto) {
    return 'This action adds a new grammar';
  }

  async createMultiple(createGrammarDto: CreateGrammarDto[], user: IUser) {
    const titles = createGrammarDto.map(grammar => grammar.title);
    const isExist = await this.grammarModel.find({
      title: { $in: titles }
    });
    if (isExist.length) {
      const existTitles = isExist.map(grammar => grammar.title);
      throw new BadRequestException(`Grammars with these titles are already exist: ${existTitles.join(', ')}`);
    }
    const newGrammars = await this.grammarModel.insertMany(
      createGrammarDto.map(grammar => ({
        ...grammar,
        createdBy: {
          _id: user._id,
          email: user.email,
        }
      }))
    );
    return newGrammars;
  }

  async findQuestionsByAI(id: string) {
    const grammar = await this.grammarModel.findById(id)
    if (!grammar) {
      throw new BadRequestException('Grammar not found')
    }

    const prompt = `
Bạn là chuyên gia ngữ pháp tiếng Anh.

Dưới đây là nội dung bài ngữ pháp mà người học vừa đọc:
"""
${grammar.content}
"""

🎯 Nhiệm vụ của bạn:
Hãy tạo ra 5 câu hỏi luyện tập để giúp người học hiểu và áp dụng ngữ pháp này tốt hơn.

Yêu cầu:
- Câu hỏi phải liên quan trực tiếp đến nội dung ngữ pháp trên.
- Đa dạng loại câu hỏi: trắc nghiệm (4 lựa chọn), điền từ, hoặc chọn câu đúng.
- Mỗi câu hỏi chỉ nên ngắn gọn, cấp độ Beginner – Intermediate.
- Bao gồm đáp án đúng và lời giải thích ngắn.
- Trả về đúng định dạng JSON dưới đây, không thêm bất kỳ văn bản nào ngoài JSON.

Định dạng JSON mẫu:
{
  "grammarTitle": "${grammar.title}",
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Chọn câu đúng theo cấu trúc Subject + Verb + Object.",
      "options": [
        "He plays guitar every day.",
        "Plays he guitar every day.",
        "He play guitar every day.",
        "Guitar he plays every day."
      ],
      "correctAnswer": "He plays guitar every day.",
      "explanation": "Theo cấu trúc S + V + O, chủ ngữ 'He' đứng trước động từ 'plays'."
    },
    {
      "type": "fill_in_blank",
      "question": "______ plays the guitar every evening.",
      "correctAnswer": "He",
      "explanation": "Chủ ngữ 'He' phù hợp với cấu trúc S + V + O."
    }
  ]
}
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

    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");
    const jsonString =
      jsonStart !== -1 && jsonEnd !== -1
        ? rawText.slice(jsonStart, jsonEnd + 1)
        : rawText;

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn("⚠️ AI output not valid JSON, returning raw text.");
      return { overallFeedback: rawText };
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.grammarModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.grammarModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} grammar`;
  }

  update(id: number, updateGrammarDto: UpdateGrammarDto) {
    return `This action updates a #${id} grammar`;
  }

  remove(id: number) {
    return `This action removes a #${id} grammar`;
  }
}
