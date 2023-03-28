import {
  validateOrReject,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
  IsEmail,
} from 'class-validator';

import Invitation from './invitation';

export default class User {
  @IsDefined()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public username?: string | null;

  private _avatar: string;

  public receivedInvitation?: Invitation;
  public sentInvitation?: Invitation;
  public friendship?: Invitation;

  private constructor(id: number, email: string, username?: string | null) {
    this.id = id;
    this.email = email;
    this.username = username;
    this._avatar = `https://avatars.dicebear.com/api/initials/${this.username}.svg`;
  }

  static make(id: number, email: string, username?: string | null): User {
    const user = new User(id, email, username);
    User.validate(user);

    return user;
  }

  get avatar(): string {
    return this._avatar;
  }

  private static async validate(user: User): Promise<void> {
    await validateOrReject(user).catch((errors) => {
      throw new InvalidUserException(
        Object.values(errors[0].constraints as string).join(', ')
      );
    });
  }

  static fromJson(json: any): User {
    const user = User.make(json.id, json.email, json.username);

    if (json.received_invitation)
      user.receivedInvitation = Invitation.fromJson(json.received_invitation);

    if (json.sent_invitation)
      user.sentInvitation = Invitation.fromJson(json.sent_invitation);

    if (json.friendship) user.friendship = Invitation.fromJson(json.friendship);

    return user;
  }
}

export class InvalidUserException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserException';
  }
}
