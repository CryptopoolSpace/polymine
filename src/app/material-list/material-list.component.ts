import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { MainService } from "../main.service";
import { Resource } from "../model/resource/resource";
import { Subscription } from "rxjs";

@Component({
  selector: "app-Crypto-list",
  templateUrl: "./Crypto-list.component.html",
  styleUrls: ["./Crypto-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoListComponent implements OnInit, OnDestroy {
  @HostBinding("class")
  subNav = "sub-nav";

  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getResId(index, base: Resource) {
    return base.id;
  }
}
