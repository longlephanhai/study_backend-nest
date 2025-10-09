declare global {
  interface IUser {
    _id: mongoose.Schema.Types.ObjectId;
    fullName: string;
    age: number;
    email: string;
    avatar: string;
    phone: number;
    address: string;
    role: string;
    targetScore: number;
  }

  interface PromptDto {
    writingId: string;
    title: string;
    description: string;
    content: string;
    minWords?: number;
    maxWords?: number;
    level?: string;
  }

  interface WritingFeedback {
    overallFeedback: string;
    grammarErrors: {
      original: string;
      correction: string;
      explanation: string;
    }[];
    vocabularySuggestions: {
      word: string;
      suggestion: string;
      reason: string;
    }[];
    structureFeedback: string;
    score: {
      grammar: number;
      vocabulary: number;
      coherence: number;
      taskResponse: number;
      overall: number;
    };
    improvedVersion?: string;
  }

}

export { };
