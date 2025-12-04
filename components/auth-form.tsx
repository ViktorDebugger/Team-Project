/** localStorage key for user data */
export const USER_KEY = 'user';

/** User data type */
export interface UserData {
  name: string;
  email: string;
  role: 'student' | 'teacher';
}
