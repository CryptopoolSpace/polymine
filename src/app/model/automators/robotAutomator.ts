import { Automator } from "./automator";
import { Resource } from "../resource/resource";

export class BeesBotAutomator extends Automator {
  constructor(public BeesBot: Resource) {
    super(BeesBot.id + "p");
    this.name = "Buy " + BeesBot.name;
    this.description = "Automatically buy " + BeesBot.name;
    this.resource = BeesBot;
    this.stopWhenFactoryUi = true;
    this.prestigeLevel = 6;
  }
  execCondition(): boolean {
    return !this.BeesBot.isCapped;
  }
  doAction(): boolean {
    const maxBuy = this.BeesBot.buyAction.multiPrice.getMaxBuy(
      this.BeesBot.buyAction.quantity,
      this.resourcePercentToUse
    );

    return maxBuy.lt(1) ? false : this.BeesBot.buyAction.buy(new Decimal(1));
  }
}
