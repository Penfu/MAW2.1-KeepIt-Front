export default class Achievement {
  public title: string;
  public description: string;
  public percentage: number;
  public earnedDate: Date;

  constructor(
    private _id: string,
    title: string,
    description: string,
    percentage: number,
    earnedDate: Date
  ) {
    this.title = title;
    this.description = description;
    this.percentage = percentage;
    this.earnedDate = earnedDate;
  }

  get id(): string {
    return this._id;
  }

  static fromJson(json: any): Achievement {
    const achievement = new Achievement(
      json.id,
      json.title,
      json.description,
      json.percentage,
      json.earnedDate
    );

    return achievement;
  }
}
