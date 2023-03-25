export default class Achievement {
  public title: string;
  public description: string;
  public percentage: number;
  public earnedDate: string;

  constructor(
    private _id: string,
    title: string,
    description: string,
    percentage: number,
    earnedDate: string
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
      json.created_at
    );

    return achievement;
  }
}
