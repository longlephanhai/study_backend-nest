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
    private configService: ConfigService
  ) {
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('API_GEMINI_KEY')!);
    this.genAiProModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  }

  async create(createSurveyDto: CreateSurveyDto, @User() user: IUser) {
    // 1️⃣ Tạo survey trước
    const newSurvey = await this.surveyModel.create({
      ...createSurveyDto,
      userId: user._id,
    });

    // 2️⃣ Tạo prompt cho AI
    const prompt = `
Bạn là hệ thống tạo lộ trình học TOEIC cá nhân hóa cho người dùng.

Dưới đây là thông tin khảo sát của người dùng:
${JSON.stringify(createSurveyDto, null, 2)}

🎯 Mục tiêu: Sinh ra kế hoạch học TOEIC kéo dài 30 ngày (1 tháng), được cá nhân hóa dựa trên thông tin khảo sát.

---

## ⚙️ QUY ĐỊNH TỔNG QUAN

- Chỉ trả về **JSON hợp lệ**, không kèm theo giải thích hoặc text.
- Bao gồm 4 phần:
  1️⃣ learningPath  
  2️⃣ learningSteps[] (30 bước tương ứng 30 ngày)  
  3️⃣ learningTasks[] (mỗi step 3–5 task cụ thể)  
  4️⃣ userTaskProgress[]

- Mỗi **step**:
  - "order" chạy từ 1 đến 30.
  - "unlockAt": ngày mở tương ứng (bắt đầu từ hôm nay, step sau +1 ngày).
  - "tasks": để trống [] (vì sẽ được map từ learningTasks).

- Mỗi **task**:
  - Thuộc 1 step thông qua "relatedStep" (từ 1 đến 30).
  - "isLocked": false cho task đầu tiên của mỗi step, true cho các task khác.
  - "type" nằm trong: ["video", "reading", "listening", "quiz", "practice"].
  - Mô tả rõ ràng, có ý nghĩa TOEIC thực tế (Listening, Reading, Vocabulary, Grammar, Test practice...).

- "steps" trong learningPath phải là [] (rỗng).

---

## 📘 CẤU TRÚC CỤ THỂ

### 1️⃣ learningPath
{
  "userId": "ObjectId của người dùng",
  "title": "Lộ trình chinh phục TOEIC trong 30 ngày",
  "description": "Lộ trình cá nhân hóa được thiết kế dựa trên dữ liệu khảo sát để đạt mục tiêu điểm TOEIC mong muốn.",
  "survey": "ObjectId",
  "steps": [],
  "currentDay": 1,
  "isCompleted": false
}

### 2️⃣ learningSteps[]
[
  {
    "title": "Ngày 1 - Làm quen và đánh giá năng lực",
    "description": "Khởi động hành trình TOEIC: kiểm tra trình độ đầu vào và giới thiệu kỹ năng Listening & Reading.",
    "order": 1,
    "tasks": [],
    "unlockAt": "ISO Date string"
  },
  ...
  (đến ngày 30)
]

### 3️⃣ learningTasks[]
[
  {
    "title": "Giới thiệu bài thi TOEIC",
    "description": "Xem video tổng quan về cấu trúc bài thi TOEIC và các mẹo làm bài.",
    "resourceUrl": "https://example.com/toeic-intro",
    "type": "video",
    "isLocked": false,
    "relatedStep": 1
  },
  {
    "title": "Mini Test Listening",
    "description": "Làm bài kiểm tra Listening ngắn (Part 1–2) để xác định điểm mạnh yếu.",
    "resourceUrl": "https://example.com/listening-test",
    "type": "quiz",
    "isLocked": true,
    "relatedStep": 1
  },
  ...
]

### 4️⃣ userTaskProgress[]
[
  {
    "userId": "ObjectId của người dùng",
    "taskId": "ObjectId (sẽ gán sau khi lưu)",
    "completed": false,
    "submittedAt": null,
    "score": 0,
    "feedback": ""
  }
]

---

## 🧠 YÊU CẦU VỀ NỘI DUNG HỌC
- Tập trung vào 4 kỹ năng TOEIC: Listening, Reading, Vocabulary, Grammar.
- Cấu trúc gợi ý:
  - Ngày 1–5: Ôn tập nền tảng, kiểm tra đầu vào, học mẹo Listening.
  - Ngày 6–10: Listening Part 1–2.
  - Ngày 11–15: Listening Part 3–4.
  - Ngày 16–20: Reading Part 5–6.
  - Ngày 21–25: Reading Part 7.
  - Ngày 26–29: Practice test full.
  - Ngày 30: Tổng kết & đánh giá kết quả.
- Mỗi task nên ngắn gọn, rõ ràng, mô tả chi tiết (ví dụ: “Học 20 từ vựng Part 3”, “Làm bài luyện nghe hội thoại dài”).

---

## 📦 OUTPUT JSON FORMAT

{
  "learningPath": { ... },
  "learningSteps": [ ... ],
  "learningTasks": [ ... ],
  "userTaskProgress": [ ... ]
}
`;


    // 3️⃣ Gọi AI
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
      console.error("⚠️ JSON parse lỗi:", error, rawText);
      throw new BadRequestException("AI trả về dữ liệu không hợp lệ");
    }

    const { learningPath, learningSteps, learningTasks } = parsedData;

    // 4️⃣ Làm sạch dữ liệu để tránh lỗi Cast
    const cleanLearningPath = {
      ...learningPath,
      steps: [], // luôn là mảng rỗng
      userId: user._id,
      survey: newSurvey._id,
    };

    // 5️⃣ Tạo LearningPath
    const createdPath = await this.learningPathModel.create(cleanLearningPath);

    // 6️⃣ Tạo Steps
    const createdSteps = await this.learningStepModel.insertMany(learningSteps);

    // 7️⃣ Tạo Tasks 
    const createdTasks = await this.learningTaskModel.insertMany(
      learningTasks.map((t: any) => {
        return {
          ...t,
        };
      })
    );

    // gán tasks vào đúng steps
    for (const step of createdSteps) {
      const tasksForStep = createdTasks.filter(t => t.relatedStep === step.order);
      step.tasks = tasksForStep.map(t => t._id);
      await step.save();
    }
    // gán steps vào learningPath
    createdPath.steps = createdSteps.map(s => s._id);
    await createdPath.save();

    // 9️⃣ Tạo User Progress
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

    // 🔟 Trả kết quả
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
