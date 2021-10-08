import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { SearchJob } from "src/app/model/enemy/searchJob";
import {
  MAX_ENEMY_LIST_SIZE,
  EnemyManager
} from "src/app/model/enemy/enemyManager";
import { Subscription } from "rxjs";
import { AllSkillEffects } from "src/app/model/prestige/allSkillEffects";
declare let preventScroll;
@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding("class")
  contentArea = "content-area";
  searchValid = true;
  valid = true;
  limited = false;
  deleteModal = false;
  moreSearch = false;
  Polybees = false;
  cry = false;
  hab = false;
  hab2 = false;
  rand = false;
  BeesBot = false;
  automatorTab = false;
  deleteAllModal = false;
  EnemyManager = EnemyManager;
  bonusCount = 0;

  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.automatorTab =
      this.ms.Miners.automatorManager.searchAutomators.findIndex(a =>
        a.isUnlocked()
      ) > -1;

    this.moreSearch =
      AllSkillEffects.SEARCH_CRY.numOwned > 0 ||
      AllSkillEffects.SEARCH_Polybees.numOwned > 0 ||
      AllSkillEffects.SEARCH_HAB.numOwned > 0 ||
      AllSkillEffects.SEARCH_HAB2.numOwned > 0 ||
      AllSkillEffects.SEARCH_RANDOM.numOwned > 0 ||
      AllSkillEffects.SEARCH_BeesBot.numOwned > 0;

    this.Polybees = AllSkillEffects.SEARCH_Polybees.numOwned > 0;
    this.cry = AllSkillEffects.SEARCH_CRY.numOwned > 0;
    this.hab = AllSkillEffects.SEARCH_HAB.numOwned > 0;
    this.hab2 = AllSkillEffects.SEARCH_HAB2.numOwned > 0;
    this.rand = AllSkillEffects.SEARCH_RANDOM.numOwned > 0;
    this.BeesBot = AllSkillEffects.SEARCH_BeesBot.numOwned > 0;

    this.validate();

    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.validate();
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  generate() {
    this.ms.Miners.enemyManager.startSearching(this.ms.Miners.userSearchLevel);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.ms.Miners.enemyManager.searchJobs,
      event.previousIndex,
      event.currentIndex
    );
  }
  getJobId(index: number, job: SearchJob) {
    return job.id.toString();
  }
  validate() {
    this.limited =
      this.ms.Miners.enemyManager.getTotalEnemy() < MAX_ENEMY_LIST_SIZE;
    this.valid = this.isValid();
    this.bonusCount =
      (this.ms.Miners.enemyManager.morePolybees ? 1 : 0) +
      (this.ms.Miners.enemyManager.moreNectar ? 1 : 0) +
      (this.ms.Miners.enemyManager.moreHabitable ? 1 : 0) +
      (this.ms.Miners.enemyManager.moreHabitable2 ? 1 : 0) +
      (this.ms.Miners.enemyManager.moreBeesBot ? 1 : 0);
  }
  isValid(): boolean {
    return (
      this.ms.Miners.enemyManager.getTotalEnemy() < MAX_ENEMY_LIST_SIZE &&
      (Number.isInteger(this.ms.Miners.userSearchLevel) &&
        this.ms.Miners.userSearchLevel >= 1 &&
        this.ms.Miners.userSearchLevel <= this.ms.Miners.enemyManager.maxLevel)
    );
  }
  sortAsc() {
    this.ms.Miners.enemyManager.allEnemy.sort((a, b) => a.level - b.level);
  }
  sortDesc() {
    this.ms.Miners.enemyManager.allEnemy.sort((a, b) => b.level - a.level);
  }
  massDelete() {
    this.ms.Miners.enemyManager.allEnemy = this.ms.Miners.enemyManager.allEnemy.filter(
      a => a.level >= this.ms.Miners.userSearchLevel
    );
    this.deleteModal = false;
  }
  deleteAll() {
    this.ms.Miners.enemyManager.allEnemy = [];
    this.deleteAllModal = false;
  }
}
