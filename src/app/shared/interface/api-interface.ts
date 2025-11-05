export interface ISignup {
  message: string;
  data: IData;
}

interface IData {
  token: string;
  user: IUser;
}

interface IUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ILogin extends ISignup {}
