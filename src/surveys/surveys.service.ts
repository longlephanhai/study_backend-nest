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

  // Lấy dữ liệu câu hỏi từ DB
  const partOneData = await this.part1Service.findAll();
  const partTwoData = await this.part2Service.findAll();
  const partThreeData = await this.part3Service.findAll();
  const partFourData = await this.part4Service.findAll();
  const partFiveData = await this.part5Service.findAll();
  const partSixData = await this.part6Service.findAll();
  const partSevenData = await this.part7Service.findAll();
  const grammarsData = await this.grammarsService.findAllWithoutPagination();

  // Tạo prompt AI
  const prompt = `
Bạn là hệ thống tạo lộ trình học TOEIC 30 ngày cho người dùng.

Thông tin Survey và người dùng:
- Survey ID: ${newSurvey._id}
- User ID: ${user._id}
- Dữ liệu khảo sát: ${JSON.stringify(createSurveyDto, null, 2)}

Dữ liệu hiện có:
- partOneData = ${JSON.stringify(partOneData.map(p => ({ id: p._id })))}  
- partTwoData = ${JSON.stringify(partTwoData.map(p => ({ id: p._id })))}  
- partThreeData = ${JSON.stringify(partThreeData.map(p => ({ id: p._id })))}  
- partFourData = ${JSON.stringify(partFourData.map(p => ({ id: p._id })))}  
- partFiveData = ${JSON.stringify(partFiveData.map(p => ({ id: p._id })))}  
- partSixData = ${JSON.stringify(partSixData.map(p => ({ id: p._id })))}  
- partSevenData = ${JSON.stringify(partSevenData.map(p => ({ id: p._id })))}  
- grammarsData = ${JSON.stringify(grammarsData.map(g => ({ id: g._id })))}  

---------------------------------------
YÊU CẦU SINH RA DUY NHẤT JSON:
{
  "learningPath": {},
  "learningSteps": [],
  "learningTasks": [],
  "userTaskProgress": []
}
---------------------------------------

QUY ĐỊNH:
- content: phải là MẢNG ObjectId (string[])
- Grammar → content là mảng 1 phần tử
- Listening / Reading → 3–10 câu tùy mức
- Practice test → có thể mix nhiều Part

---------------------------------------
learningPath:
---------------------------------------
- userId = "${user._id}"
- survey = "${newSurvey._id}"
- title: "Lộ trình chinh phục TOEIC trong 30 ngày"
- description: "Lộ trình cá nhân hóa dựa trên khảo sát"
- steps: []
- currentDay: 1
- isCompleted: false

---------------------------------------
learningSteps (30 ngày):
---------------------------------------
- 30 step
- mỗi step:
  {
    "title": "",
    "description": "",
    "order": 1..30,
    "tasks": [],
    "unlockAt": ISODateString
  }

---------------------------------------
learningTasks:
---------------------------------------
- mỗi step 3–5 task
- mỗi task:
{
  "title": "",
  "description": "",
  "type": "Part1"|"Part2"|"Part3"|"Part4"|"Part5"|"Part6"|"Part7"|"Grammar",
  "content": ["id1","id2",...],
  "relatedStep": number,
  "isLocked": false
}

---------------------------------------
userTaskProgress:
---------------------------------------
- userId: "${user._id}"
- taskId: gán sau tại backend
- completed: false
- score: 0
- submittedAt: null
- feedback: ""

---------------------------------------
CHỈ TRẢ VỀ JSON — KHÔNG THÊM GIẢI THÍCH
---------------------------------------
`;

  // Gọi AI
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

  // Tạo learningPath
  const createdPath = await this.learningPathModel.create({
    ...learningPath,
    steps: [],
    userId: user._id,
    survey: newSurvey._id,
  });

  // Tạo Steps
  const createdSteps = await this.learningStepModel.insertMany(
    learningSteps.map((s: any, idx: number) => ({
      ...s,
      unlockAt: s.unlockAt || new Date(Date.now() + idx * 24 * 60 * 60 * 1000),
      tasks: [],
    }))
  );

  // Tạo Tasks — CHỈ GIỮ content AS-IS (MẢNG)
  const createdTasks = await this.learningTaskModel.insertMany(
    learningTasks.map((t: any) => ({
      ...t,
      content: Array.isArray(t.content) ? t.content : [],
    }))
  );

  // Gán task vào step
  for (const step of createdSteps) {
    const tasksForStep = createdTasks.filter(
      (t) => t.relatedStep === step.order
    );
    step.tasks = tasksForStep.map((t) => t._id);
    await step.save();
  }

  // Gán steps vào path
  createdPath.steps = createdSteps.map((s) => s._id);
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
