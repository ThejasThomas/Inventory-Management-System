export interface UserDTO {
  userId?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password:string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILoginData{
  email:string;
  password:string;
}