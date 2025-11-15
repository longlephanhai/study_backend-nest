import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Survey } from './schema/survey.schema';
import { Model } from 'mongoose';
import { User } from 'src/decorator/customize';
import { LearningPath } from 'src/learning-path/schema/learning-path.schema';
import { LearningStep } from 'src/learning-step/schema/learning-step.schema';
import { LearningTask } from 'src/learning-task/schema/learning-task.schema';
import { UserTaskProgress } from 'src/user-task-progress/schema/user-task-progress.schema';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { Part1Service } from 'src/part1/part1.service';
import { Part2Service } from 'src/part2/part2.service';
import { Part3Service } from 'src/part3/part3.service';
import { Part4Service } from 'src/part4/part4.service';
import { Part5Service } from 'src/part5/part5.service';
import { Part6Service } from 'src/part6/part6.service';
import { Part7Service } from 'src/part7/part7.service';
import { GrammarsService } from 'src/grammars/grammars.service';

@Injectable()
export class SurveysService {
  private genAI: GoogleGenerativeAI;
  private genAiProModel: any;

  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
    @InjectModel(LearningPath.name) private learningPathModel: Model<LearningPath>,
    @InjectModel(LearningStep.name) private learningStepModel: Model<LearningStep>,
    @InjectModel(LearningTask.name) private learningTaskModel: Model<LearningTask>,
    @InjectModel(UserTaskProgress.name) private userTaskProgressModel: Model<UserTaskProgress>,
    private configService: ConfigService,
    private readonly part1Service: Part1Service,
    private readonly part2Service: Part2Service,
    private readonly part3Service: Part3Service,
    private readonly part4Service: Part4Service,
    private readonly part5Service: Part5Service,
    private readonly part6Service: Part6Service,
    private readonly part7Service: Part7Service,
    private readonly grammarsService: GrammarsService,
  ) {
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('API_GEMINI_KEY')!);
    this.genAiProModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  }

  async create(createSurveyDto: CreateSurveyDto, @User() user: IUser) {
    // Tạo Survey
    const newSurvey = await this.surveyModel.create({
      ...createSurveyDto,
      userId: user._id,
    });

    // Lấy dữ liệu từ các Part và Grammar
    const partOneData = await this.part1Service.findAll();
    const partTwoData = await this.part2Service.findAll();
    const partThreeData = await this.part3Service.findAll();
    const partFourData = await this.part4Service.findAll();
    const partFiveData = await this.part5Service.findAll();
    const partSixData = await this.part6Service.findAll();
    const partSevenData = await this.part7Service.findAll();
    const grammarsData = await this.grammarsService.findAllWithoutPagination();

    //  Chuẩn bị prompt cho AI
    const prompt = `
Bạn là hệ thống tạo lộ trình học TOEIC cá nhân hóa cho người dùng.

Thông tin Survey và người dùng:
- Survey ID: ${newSurvey._id}
- User ID: ${user._id}
- Dữ liệu khảo sát: ${JSON.stringify(createSurveyDto, null, 2)}

Dữ liệu hiện có để tạo task:
- partOneData = ${JSON.stringify(partOneData.map(p => ({ id: p._id, transcript: p.transcript })))}  
- partTwoData = ${JSON.stringify(partTwoData.map(p => ({ id: p._id, transcript: p.transcript })))}  
- partThreeData = ${JSON.stringify(partThreeData.map(p => ({ id: p._id, transcript: p.transcript })))}  
- partFourData = ${JSON.stringify(partFourData.map(p => ({ id: p._id, transcript: p.transcript })))}  
- partFiveData = ${JSON.stringify(partFiveData.map(p => ({ id: p._id, questionContent: p.questionContent })))}  
- partSixData = ${JSON.stringify(partSixData.map(p => ({ id: p._id, questionContent: p.questionContent })))}  
- partSevenData = ${JSON.stringify(partSevenData.map(p => ({ id: p._id, questionContent: p.questionContent })))}  
- grammarsData = ${JSON.stringify(grammarsData.map(g => ({ id: g._id, title: g.title })))}  

Yêu cầu tạo lộ trình TOEIC 30 ngày:

1️ learningPath:
- userId = ${user._id}
- survey = ${newSurvey._id}
- title: "Lộ trình chinh phục TOEIC trong 30 ngày"
- description: "Lộ trình cá nhân hóa dựa trên dữ liệu khảo sát"
- steps: [] (AI không cần điền)
- currentDay: 1
- isCompleted: false

2️ learningSteps[]:
- 30 bước tương ứng 30 ngày
- Mỗi step có:
  - title: ngắn gọn, ví dụ "Ngày 1 - Làm quen và đánh giá năng lực"
  - description: chi tiết
  - order: 1 → 30
  - tasks: [] (AI không điền, sẽ map sau)
  - unlockAt: ISO Date string
- Cố gắng phân bổ các loại task hợp lý theo ngày:
  - Ngày 1–5: ôn tập nền tảng, listening cơ bản, grammar
  - Ngày 6–10: Part1–Part2
  - Ngày 11–15: Part3–Part4
  - Ngày 16–20: Part5–Part6
  - Ngày 21–25: Part7
  - Ngày 26–29: Practice test full
  - Ngày 30: Tổng kết & đánh giá

3️ learningTasks[]:
- Mỗi task có:
  - title: ngắn gọn
  - description: chi tiết, rõ ràng
  - type: "Part1" | "Part2" | ... | "Part7" | "Grammar"
  - content: ObjectId từ dữ liệu tương ứng (id trong partOneData → Part1, grammarsData → Grammar, ...)
  - relatedStep: số step (1 → 30)
  - isLocked: false cho task đầu tiên mỗi step, true cho các task còn lại
- Mỗi step tạo 3–5 task
- Task nên đa dạng: Listening, Reading, Vocabulary, Grammar, Quiz, Practice

4️ userTaskProgress[]:
- Chỉ tạo template: 
  - userId = ${user._id}
  - taskId (gán sau)
  - completed: false
  - score: 0
  - submittedAt: null
  - feedback: ""

 Lưu ý:
- Chỉ trả về **JSON hợp lệ**
- JSON có keys: "learningPath", "learningSteps", "learningTasks"
- Không kèm giải thích hay text nào khác

Ví dụ JSON trả về:
{
  "learningPath": { ... },
  "learningSteps": [ ... ],
  "learningTasks": [ ... ],
  "userTaskProgress": [ ... ]
}
`;


    //  Gọi AI tạo nội dung
    const result = await this.genAiProModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const rawText = result.response.text();
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");
    const jsonString =
      jsonStart !== -1 && jsonEnd !== -1
        ? rawText.slice(jsonStart, jsonEnd + 1)
        : rawText;

    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (error) {
      console.error("JSON parse lỗi:", error, rawText);
      throw new BadRequestException("AI trả về dữ liệu không hợp lệ");
    }

    const { learningPath, learningSteps, learningTasks } = parsedData;

    //  Làm sạch learningPath
    const cleanLearningPath = {
      ...learningPath,
      steps: [],
      userId: user._id,
      survey: newSurvey._id,
    };

    const createdPath = await this.learningPathModel.create(cleanLearningPath);

    //  Tạo learningSteps
    const createdSteps = await this.learningStepModel.insertMany(
      learningSteps.map((s: any, idx: number) => ({
        ...s,
        unlockAt: s.unlockAt || new Date(Date.now() + idx * 24 * 60 * 60 * 1000), // default: mỗi step +1 ngày
        tasks: [],
      }))
    );

    //  Tạo learningTasks và map ObjectId cho content
    const createdTasks = await this.learningTaskModel.insertMany(
      learningTasks.map((t: any) => {
        let contentId: string | null = null;

        switch (t.type) {
          case "Part1":
            contentId = partOneData.find(p => p.type === t.type)?._id?.toString() ?? null;
            break;
          case "Part2":
            contentId = partTwoData.find(p => p.type === t.type)?._id?.toString() ?? null;
            break;
          case "Part3":
            contentId = partThreeData.find(p => p.type === t.type)?._id?.toString() ?? null;
            break;
          case "Part4":
            contentId = partFourData.find(p => p.type === t.type)?._id?.toString() ?? null;
            break;
          case "Part5":
            contentId = partFiveData.find(p => p.type === t.type)?._id?.toString() ?? null;
            break;
          case "Part6":
            contentId = partSixData.find(p => p.type === t.type)?._id?.toString() ?? null;
            break;
          case "Part7":
            contentId = partSevenData.find(p => p.type === t.type)?._id?.toString() ?? null;
            break;
          case "Grammar":
            contentId = grammarsData.find(g => g.type === t.type)?._id?.toString() ?? null;
            break;
        }

        return {
          ...t,
          content: contentId,
        };
      })
    );

    //  Gán tasks vào steps
    for (const step of createdSteps) {
      const tasksForStep = createdTasks.filter(t => t.relatedStep === step.order);
      step.tasks = tasksForStep.map(t => t._id);
      await step.save();
    }

    //  Gán steps vào learningPath
    createdPath.steps = createdSteps.map(s => s._id);
    await createdPath.save();

    // Tạo UserTaskProgress
    await this.userTaskProgressModel.insertMany(
      createdTasks.map((task: any) => ({
        userId: user._id,
        taskId: task._id,
        completed: false,
        submittedAt: null,
        score: 0,
        feedback: "",
      }))
    );

  
    return {
      survey: newSurvey,
      learningPath: createdPath,
      learningSteps: createdSteps,
      learningTasks: createdTasks,
    };
  }




  findAll() {
    return `This action returns all surveys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} survey`;
  }

  update(id: number, updateSurveyDto: UpdateSurveyDto) {
    return `This action updates a #${id} survey`;
  }

  remove(id: number) {
    return `This action removes a #${id} survey`;
  }
}
