export interface UserType {
    _id?: string;
    name: string;
    email: string;
    password: string;
    decryptedPassword: string;
    profilePicture: string;
    role: 'admin' | 'user';
    createdAt?: Date;
    updatedAt?: Date;
  }
  