import {
  validateOrReject,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';

export default class User {
  @IsDefined()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public username?: string | null;

  constructor(id: string, email: string, username?: string | null) {
    this.email = email;
    this.username = username;
    this.id = id;
  }

  static async fromJson(json: any): Promise<User> {
    const user = new User(json.id, json.email, json.username);

    await validateOrReject(user).catch((errors) => {
      return Promise.reject(errors);
    });

    return user;
  }
}
