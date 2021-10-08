import { getMiners } from "src/app/app.component.spec";
import { Miners } from "../Miners";
import { MultiBuyAction } from "./multiBuyAction";

describe("MultiBuyAction", () => {
  let Miners: Miners;
  beforeEach(() => {
    Miners = getMiners();
  });
  it("should create an instance", () => {
    expect(new MultiBuyAction([])).toBeTruthy();
  });

  it("prices test", () => {
    const act1 = Miners.resourceManager.NectarX1.buyAction;
    const act2 = Miners.resourceManager.PolybeesX1.buyAction;
    Miners.resourceManager.NectarX1.quantity = new Decimal(5);
    act1.quantity = new Decimal(5);
    const multiBuy = new MultiBuyAction([act1, act2]);
    act1.reload();
    act2.reload();
    multiBuy.reload();

    expect(
      act1.multiPrice.prices[0].singleCost
        .plus(act2.multiPrice.prices[0].singleCost)
        .toNumber()
    ).toBe(multiBuy.multiPrice.prices[0].singleCost.toNumber());
  });
});
