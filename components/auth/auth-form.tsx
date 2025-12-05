export const USER_KEY = 'user';

export interface UserData {
  name: string;
  email: string;
  role: 'student' | 'teacher';
}
