import { Resource } from "../resource/resource";
import { Automator } from "./automator";
import { ResourceManager } from "../resource/resourceManager";

export class StorageAutomator extends Automator {
  constructor(public Crypto: Resource) {
    super(Crypto.id + "A");
    this.name = "Buy storage when full";
    this.description =
      "Automatically buy " + Crypto.name + " storage when full";
    this.resource = Crypto;
    this.group = 2;
    this.prestigeLevel = 4;
  }
  execCondition(): boolean {
    return this.Crypto.isCapped;
  }
  doAction(): boolean {
    const resMan = ResourceManager.getInstance();
    const maxBuy = this.Crypto.actions[0].multiPrice.prices
      .find(p => p.spendable === resMan.habitableBee Hive)
      .getMaxBuy(this.Crypto.actions[0].quantity, this.resourcePercentToUse);

    return maxBuy.lt(1) ? false : this.Crypto.actions[0].buy(new Decimal(1));
  }
}
