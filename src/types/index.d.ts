/* eslint-disable no-var */

declare global {
  interface IUser {
    _id: mongoose.Schema.Types.ObjectId;
    fullName: string;
    age: number;
    email: string;
    avatar: string;
    phone: number;
    address: string;
  }
}

export { };
