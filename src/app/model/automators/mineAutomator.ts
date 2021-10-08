import { Automator } from "./automator";
import { Resource } from "../resource/resource";

export class MineAutomator extends Automator {
  constructor(public BeesBot: Resource) {
    super(BeesBot.id + "M");
    this.name = "Buy " + BeesBot.actions[1].name;
    this.description = "Automatically buy " + BeesBot.actions[1].name;
    this.resource = BeesBot;
    this.group = 2;
    this.prestigeLevel = 13;
  }
  execCondition(): boolean {
    return this.BeesBot.isCapped;
  }
  doAction(): boolean {
    const maxBuy = this.BeesBot.actions[1].multiPrice.getMaxBuy(
      this.BeesBot.actions[1].quantity,
      this.resourcePercentToUse
    );

    return maxBuy.lt(1) ? false : this.BeesBot.actions[1].buy(new Decimal(1));
  }
}
