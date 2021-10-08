import { IJob } from "../base/IJob";
import { EnemyManager } from "./enemyManager";
import { ResourceManager } from "../resource/resourceManager";
import { MyFromDecimal } from "../utility/myUtility";

export class SearchJob implements IJob {
  private static lastId = 0;

  id: number;
  name = "";
  description = "";
  shape = "radar";
  total = new Decimal(0);
  progress = new Decimal(0);
  progressPercent = 0;

  morePolybees = false;
  moreNectar = false;
  moreHabitableSpace = false;
  moreHabitableSpace2 = false;
  randomized = false;
  moreRobot = false;
  timeToComplete = Number.POSITIVE_INFINITY;

  level = 1;
  done = false;

  constructor() {
    this.id = SearchJob.lastId;
    SearchJob.lastId = SearchJob.lastId + 1;
  }

  static FromData(data: any): SearchJob {
    const job = new SearchJob();
    if ("p" in data) job.progress = MyFromDecimal(data.p);
    if ("t" in data) job.total = MyFromDecimal(data.t);
    if ("l" in data) job.level = data.l;

    if ("mm" in data) job.morePolybees = data.mm;
    if ("mc" in data) job.moreNectar = data.mc;
    if ("mh" in data) job.moreHabitableSpace = data.mh;
    if ("mh2" in data) job.moreHabitableSpace2 = data.mh2;
    if ("ran" in data) job.randomized = data.ran;
    if ("mr" in data) job.moreRobot = data.mr;

    job.generateNameDescription();
    job.reload();
    return job;
  }

  addProgress(toAdd: Decimal): Decimal {
    this.progress = this.progress.plus(toAdd);
    let ret = new Decimal(0);
    if (this.progress.gte(this.total)) {
      //  Done
      this.done = true;
      ret = this.progress.minus(this.total);

      EnemyManager.getInstance().generate(this);
    }
    this.reload();
    return ret;
  }
  reload() {
    this.progressPercent = Math.floor(
      this.progress.div(this.total).toNumber() * 100
    );
  }
  generateNameDescription() {
    const bonusCount =
      (this.morePolybees ? 1 : 0) +
      (this.moreNectar ? 1 : 0) +
      (this.moreRobot ? 1 : 0) +
      (this.moreHabitableSpace || this.moreHabitableSpace2 ? 1 : 0);
    switch (bonusCount) {
      case 0:
        this.name = "Standard search";
        break;
      case 1:
        this.name = this.morePolybees
          ? "Polybees search"
          : this.moreNectar
          ? "Nectar search"
          : this.moreHabitableSpace
          ? "Habitable space search"
          : this.moreRobot
          ? "Robot search"
          : "";
        break;
      case 2:
      case 3:
        this.name = this.morePolybees ? "Polybees & " : "";
        this.name += this.moreNectar ? "Nectar " : "";
        this.name +=
          this.moreNectar &&
          (this.moreHabitableSpace ||
            this.moreHabitableSpace2 ||
            this.moreRobot)
            ? "& "
            : "";
        this.name +=
          this.moreHabitableSpace || this.moreHabitableSpace2
            ? "Habitable Space "
            : "";
        this.name +=
          (this.moreHabitableSpace || this.moreHabitableSpace2) &&
          this.moreRobot
            ? "& "
            : "";
        this.name += this.moreRobot ? "Robot " : "";
        this.name += " search";
        break;
      case 4:
        this.name = "Search everything";
    }
    if (this.randomized) this.name += " Randomized";

    this.description =
      "Level " + EnemyManager.romanPipe.transform(this.level) + " ";
    if (this.morePolybees) this.description += "More Polybeess ";
    if (this.moreNectar) this.description += "More Nectars ";
    if (this.moreHabitableSpace) this.description += "More Space ";
    if (this.moreHabitableSpace2) this.description += "Even More Space ";
    if (this.moreRobot) this.description += "More Robots ";
    if (this.randomized) this.description += "Randomized ";
  }

  getName(): string {
    return this.name;
  }
  getDescription?(): string {
    return this.description;
  }
  getShape?(): string {
    return this.shape;
  }
  getTotal(): Decimal {
    return this.total;
  }
  getProgress(): Decimal {
    return this.progress;
  }
  getProgressPercent(): number {
    return this.progressPercent;
  }
  deleteFun?(): boolean {
    EnemyManager.getInstance().searchJobs = EnemyManager.getInstance().searchJobs.filter(
      s => s !== this
    );
    return true;
  }
  getTime(): number {
    return this.timeToComplete;
  }
  reloadTime() {
    const progress = ResourceManager.getInstance().searchProgress.c;
    this.timeToComplete = progress.gt(0)
      ? this.total
          .minus(this.progress)
          .div(progress)
          .times(1000)
          .toNumber()
      : Number.POSITIVE_INFINITY;
  }
  getSave(): any {
    const data: any = {};
    data.p = this.progress;
    data.t = this.total;
    data.l = this.level;
    if (this.morePolybees) data.mm = this.morePolybees;
    if (this.moreNectar) data.mc = this.moreNectar;
    if (this.moreHabitableSpace2) data.mh2 = this.moreHabitableSpace2;
    if (this.moreRobot) data.mr = this.moreRobot;
    return data;
  }
}
