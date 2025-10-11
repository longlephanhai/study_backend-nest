import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExamResultDto } from './dto/create-exam-result.dto';
import { UpdateExamResultDto } from './dto/update-exam-result.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ExamResult } from './schema/exam-result.schema';
import mongoose, { Model } from 'mongoose';
import { Question } from 'src/question/schema/question.schema';
import { listeningScoreMap, readingScoreMap } from 'src/util';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

interface IAnswer {
  questionId: mongoose.Schema.Types.ObjectId;
  answer: string;
}
interface IPart {
  partId: mongoose.Schema.Types.ObjectId;
  partNo: number;
  answers: IAnswer[];
}

@Injectable()
export class ExamResultService {
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


  async create(createExamResultDto: CreateExamResultDto, user: IUser) {
    const createdExamResult = new this.examResultModel({
      ...createExamResultDto,
      totalScore: listeningScoreMap[createExamResultDto.totalListeningCorrect] + readingScoreMap[createExamResultDto.totalReadingCorrect],
      listeningScore: listeningScoreMap[createExamResultDto.totalListeningCorrect],
      readingScore: readingScoreMap[createExamResultDto.totalReadingCorrect],
      userId: user._id,
    });
    return createdExamResult.save();
  }

  findAll() {
    return `This action returns all examResult`;
  }

  async findOne(id: string, user: IUser) {
    const examResult = await this.examResultModel.findOne({ _id: id, userId: user._id });
    if (!examResult) {
      throw new BadRequestException('Exam result not found');
    }

    const getQuestionsData = async (answerIds: mongoose.Schema.Types.ObjectId[]) => {
      if (!answerIds?.length) return [];
      const questions = await this.questionModel.find({
        _id: { $in: answerIds }
      }).select('numberQuestion category').lean();

      return questions.map(q => ({
        numberQuestion: q.numberQuestion,
        category: q.category
      }));
    };

    const correctAnswer = await getQuestionsData(examResult.correctAnswer);
    const wrongAnswer = await getQuestionsData(examResult.wrongAnswer);
    const noAnswer = await getQuestionsData(examResult.noAnswer);



    return {
      totalCorrect: examResult.totalCorrect,
      totalListeningCorrect: examResult.totalListeningCorrect,
      totalReadingCorrect: examResult.totalReadingCorrect,
      parts: examResult.parts,
      correctAnswer,
      wrongAnswer,
      noAnswer,
      totalScore: examResult.totalScore,
      readingScore: examResult.readingScore,
      listeningScore: examResult.listeningScore,
    };
  }

  async getHistoryExamResults(user: IUser) {
    return this.examResultModel.find({ userId: user._id }).select('totalScore readingScore listeningScore totalCorrect totalListeningCorrect totalReadingCorrect parts createdAt').sort({ createdAt: -1 });
  }

  async getPartCorrectCount(part: IPart) {
    let count = 0;
    const questionIds = part.answers.map(a => a.questionId);
    const questions = await this.questionModel.find({ _id: { $in: questionIds } }).select('correctAnswer').lean();
    part.answers.forEach(a => {
      const question = questions.find(q => q._id.toString() === a.questionId.toString());
      if (question && question.correctAnswer === a.answer) {
        count += 1;
      }
    });
    return count;
  }

  async getPartNoAnswerCount(part: IPart) {
    let count = 0;
    part.answers.forEach(a => {
      if (!a.answer) {
        count += 1;
      }
    });
    return count;
  }

  async adviceToImprove(
    targetScore: number,
    predictedScores: number,
    part1_correct: number,
    part2_correct: number,
    part3_correct: number,
    part4_correct: number,
    part5_correct: number,
    part6_correct: number,
    part7_correct: number,
    totalExams: number
  ) {
    const prompt = `
Bạn là chuyên gia luyện thi TOEIC.

Dưới đây là dữ liệu tổng hợp (tích lũy) về kết quả luyện thi của người học:

Thông tin người học:
- 🎯 Điểm mục tiêu: ${targetScore}
- 📊 Điểm dự đoán hiện tại: ${predictedScores}
- 🧮 Tổng số bài thi đã thực hiện: ${totalExams}

Kết quả tổng số câu đúng (tích lũy):
- Part 1: ${part1_correct} / ${totalExams} lần thi
- Part 2: ${part2_correct} / ${totalExams} lần thi
- Part 3: ${part3_correct} / ${totalExams} lần thi
- Part 4: ${part4_correct} / ${totalExams} lần thi
- Part 5: ${part5_correct} / ${totalExams} lần thi
- Part 6: ${part6_correct} / ${totalExams} lần thi
- Part 7: ${part7_correct} / ${totalExams} lần thi

Yêu cầu:
Phân tích kết quả và đưa ra lời khuyên học tập **cá nhân hóa**, tuân thủ đúng định dạng JSON sau:

[
  {
    "aspect": "Tên kỹ năng hoặc phần thi (ví dụ: Listening - Part 2 & 3)",
    "analysis": "Phân tích ngắn gọn điểm mạnh/yếu dựa trên số liệu",
    "advice": "Lời khuyên cụ thể, dễ hiểu, có thể thực hiện được",
    "example": "Ví dụ hoặc bài luyện gợi ý phù hợp"
  }
]

Hãy thực hiện lần lượt:
1. **Đánh giá tổng quan:** So sánh điểm dự đoán với mục tiêu, nêu nhận xét ngắn gọn về tiến độ hiện tại.
2. **Phân tích điểm yếu:** Chỉ ra phần hoặc kỹ năng còn yếu (nghe, đọc, ngữ pháp, từ vựng...).
3. **Đưa ra lời khuyên cải thiện:** Gợi ý hướng học tập cụ thể (thời lượng, dạng bài nên luyện...).
4. **Kế hoạch học tập:** Gợi ý kế hoạch trong 2–4 tuần giúp tiến gần đến mục tiêu.
5. **Ví dụ minh họa:** Cho ví dụ hoặc dạng bài gợi ý tương ứng.

⚠️ Chỉ trả về **JSON hợp lệ duy nhất**, không thêm mô tả, tiêu đề hoặc văn bản khác.

Gợi ý hành vi:
- Nếu người học gần đạt mục tiêu → tập trung nâng cao tốc độ và độ chính xác.
- Nếu người học còn xa → tập trung củng cố nền tảng, ngữ pháp, và từ vựng cơ bản.
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

    const jsonStart = rawText.indexOf('[');
    const jsonEnd = rawText.lastIndexOf(']');
    const jsonString =
      jsonStart !== -1 && jsonEnd !== -1
        ? rawText.slice(jsonStart, jsonEnd + 1)
        : rawText;

    try {
      const adviceList = JSON.parse(jsonString);
      return adviceList;
    } catch (error) {
      console.warn('⚠️ AI output not valid JSON, returning empty array.');
      return [];
    }
  }


  async getPredictedExamResults(user: IUser) {
    const examResults = await this.examResultModel
      .find({ userId: user._id })
      .select('totalListeningCorrect totalReadingCorrect noAnswer parts createdAt totalCorrect readingScore listeningScore targetScore')
      .sort({ createdAt: 1 })
      .lean();
    const data: any[] = [];
    if (examResults.length === 0) return data;
    await Promise.all(examResults.map(async er => {
      //@ts-ignore
      const part1_correct = er.parts && er.parts[0] ? await this.getPartCorrectCount(er.parts[0]) : 0;
      //@ts-ignore
      const part1_no_answer = er.parts && er.parts[0] ? await this.getPartNoAnswerCount(er.parts[0]) : 0;
      //@ts-ignore
      const part2_correct = er.parts && er.parts[1] ? await this.getPartCorrectCount(er.parts[1]) : 0;
      //@ts-ignore
      const part2_no_answer = er.parts && er.parts[1] ? await this.getPartNoAnswerCount(er.parts[1]) : 0;
      //@ts-ignore
      const part3_correct = er.parts && er.parts[2] ? await this.getPartCorrectCount(er.parts[2]) : 0;
      //@ts-ignore
      const part3_no_answer = er.parts && er.parts[2] ? await this.getPartNoAnswerCount(er.parts[2]) : 0;
      //@ts-ignore
      const part4_correct = er.parts && er.parts[3] ? await this.getPartCorrectCount(er.parts[3]) : 0;
      //@ts-ignore
      const part4_no_answer = er.parts && er.parts[3] ? await this.getPartNoAnswerCount(er.parts[3]) : 0;
      //@ts-ignore
      const part5_correct = er.parts && er.parts[4] ? await this.getPartCorrectCount(er.parts[4]) : 0;
      //@ts-ignore
      const part5_no_answer = er.parts && er.parts[4] ? await this.getPartNoAnswerCount(er.parts[4]) : 0;
      //@ts-ignore
      const part6_correct = er.parts && er.parts[5] ? await this.getPartCorrectCount(er.parts[5]) : 0;
      //@ts-ignore
      const part6_no_answer = er.parts && er.parts[5] ? await this.getPartNoAnswerCount(er.parts[5]) : 0;
      //@ts-ignore
      const part7_correct = er.parts && er.parts[6] ? await this.getPartCorrectCount(er.parts[6]) : 0;
      //@ts-ignore
      const part7_no_answer = er.parts && er.parts[6] ? await this.getPartNoAnswerCount(er.parts[6]) : 0;
      const days_since_first_exam = Math.floor((er.createdAt.getTime() - examResults[0].createdAt.getTime()) / (1000 * 60 * 60 * 24));
      data.push(
        {
          totalCorrect: er.totalCorrect,
          totalListeningCorrect: er.totalListeningCorrect,
          totalReadingCorrect: er.totalReadingCorrect,
          noAnswerCount: er.noAnswer.length,
          listeningScore: er.listeningScore,
          readingScoreMap: er.readingScore,
          part1_correct,
          part2_correct,
          part3_correct,
          part4_correct,
          part5_correct,
          part6_correct,
          part7_correct,
          part1_no_answer,
          part2_no_answer,
          part3_no_answer,
          part4_no_answer,
          part5_no_answer,
          part6_no_answer,
          part7_no_answer,
          days_since_first_exam,
        }
      );
    }));
    const data_predict = data.map(d => [
      d.totalCorrect,
      d.totalListeningCorrect,
      d.totalReadingCorrect,
      d.noAnswerCount,
      d.listeningScore,
      d.readingScoreMap,
      d.part1_correct,
      d.part2_correct,
      d.part3_correct,
      d.part4_correct,
      d.part5_correct,
      d.part6_correct,
      d.part7_correct,
      d.part1_no_answer,
      d.part2_no_answer,
      d.part3_no_answer,
      d.part4_no_answer,
      d.part5_no_answer,
      d.part6_no_answer,
      d.part7_no_answer,
      d.days_since_first_exam,
    ]);


    const predicted = await axios.post(`${process.env.PYTHON_SERVER_URL}`, { data_predict });

    const targetScore = user.targetScore
    const totalPartCorrect = Array.from({ length: 7 }, (_, i) =>
      data.reduce((sum, d) => sum + (d[`part${i + 1}_correct`] ?? 0), 0)
    );
    const [
      totalPart1Correct,
      totalPart2Correct,
      totalPart3Correct,
      totalPart4Correct,
      totalPart5Correct,
      totalPart6Correct,
      totalPart7Correct,
    ] = totalPartCorrect;

    const predictedScores = predicted.data.median;
    const advice = await this.adviceToImprove(
      targetScore,
      predictedScores,
      totalPart1Correct,
      totalPart2Correct,
      totalPart3Correct,
      totalPart4Correct,
      totalPart5Correct,
      totalPart6Correct,
      totalPart7Correct,
      examResults.length
    )
    return {
      predictedScores,
      advice
    }
  }


  update(id: number, updateExamResultDto: UpdateExamResultDto) {
    return `This action updates a #${id} examResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} examResult`;
  }
}
