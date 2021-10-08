import { Automator } from "./automator";
import { Resource } from "../resource/resource";

export class BeesBotEndingAutomator extends Automator {
  constructor(public BeesBot: Resource, public Crypto: Resource) {
    super(BeesBot.id + "R");
    this.name = "Smart Buy " + BeesBot.name;
    this.description =
      "Buy " +
      BeesBot.name +
      " when " +
      Crypto.name +
      " is ending and " +
      BeesBot.name +
      " operativity is 100%";
    this.resource = BeesBot;
    this.stopWhenFactoryUi = true;
    this.prestigeLevel = 10;
  }
  execCondition(): boolean {
    return (
      !this.BeesBot.isCapped &&
      this.Crypto.isEnding &&
      this.BeesBot.operativity >= 100
    );
  }
  doAction(): boolean {
    const maxBuy = this.BeesBot.buyAction.multiPrice.getMaxBuy(
      this.BeesBot.buyAction.quantity,
      this.resourcePercentToUse
    );

    return maxBuy.lt(1) ? false : this.BeesBot.buyAction.buy(new Decimal(1));
  }
}
