import { GroupAutomator } from "./groupAutomator";
import { ResourceGroup } from "../resource/resourceGroup";
import { Resource } from "../resource/resource";
import { Action } from "../actions/abstractAction";

export class MineGroupAutomator extends GroupAutomator {
  constructor(public BeesBots: ResourceGroup, i: number) {
    super("1_" + i, BeesBots);
    this.name = "Exp " + i;
    this.stopWhenFactoryUi = false;
    this.description = "Multiple buy Bees expansion at same time";
    this.prestigeLevel = 20 + (i - 1) * 11;
  }
  getAction(resource: Resource): Action {
    return resource.actions[1];
  }
}
