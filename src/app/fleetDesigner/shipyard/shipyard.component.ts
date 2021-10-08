import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Job } from "src/app/model/shipyard/job";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
declare let preventScroll;

@Component({
  selector: "app-shipyard",
  templateUrl: "./shipyard.component.html",
  styleUrls: ["./shipyard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipyardComponent implements OnInit, OnDestroy, AfterViewInit {
  totalPrice = new Decimal(0);
  totalShip = 0;

  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {
    this.ms.Miners.fleetManager.reloadSliders();
    this.ms.Miners.fleetManager.resetSliders();
    this.totalPrice = this.ms.Miners.fleetManager.getTotalPrice();

    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.onSliderChange();
        this.ms.Miners.fleetManager.reloadSliders();
        const newPrice = this.ms.Miners.fleetManager.getTotalPrice();
        if (!newPrice.eq(this.totalPrice)) this.totalPrice = newPrice;
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getJobId(index: number, job: Job) {
    return job.id.toString();
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.ms.Miners.shipyard.jobs,
      event.previousIndex,
      event.currentIndex
    );
  }
  designId(index: number, data: ShipDesign) {
    return data.id;
  }
  onSliderChange() {
    this.ms.Miners.fleetManager.sliderChange();
  }
  save() {
    this.ms.Miners.fleetManager.save();
  }
  make() {
    if (this.ms.Miners.fleetManager.save()) this.ms.Miners.fleetManager.make();
  }
}
