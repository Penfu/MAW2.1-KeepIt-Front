import {
  validateOrReject,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
  IsEmail,
} from 'class-validator';

export default class User {
  @IsDefined()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public username?: string | null;

  private constructor(id: string, email: string, username?: string | null) {
    this.email = email;
    this.username = username;
    this.id = id;
  }

  static async make(
    id: string,
    email: string,
    username?: string | null
  ): Promise<User> {
    const user = new User(id, email, username);
    await User.validate(user);
    return user;
  }

  private static async validate(user: User): Promise<void> {
    await validateOrReject(user).catch((errors) => {
      throw new InvalidUserException(
        Object.values(errors[0].constraints as string).join(', ')
      );
    });
  }

  static async fromJson(json: any): Promise<User> {
    return await User.make(json.id, json.email, json.username);
  }
}

export class InvalidUserException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserException';
  }
}
