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
}

export { };
