import { Resource } from "./resource";
import { ISalvable } from "../base/ISalvable";
import isArray from "lodash-es/isArray";
import { ResourceGroup } from "./resourceGroup";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";
import { Action } from "../actions/abstractAction";
import { Shipyard } from "../shipyard/shipyard";
import { EnemyManager } from "../enemy/enemyManager";
import { MainService } from "src/app/main.service";
import { FleetManager } from "../fleet/fleetManager";
import { AllSkillEffects } from "../prestige/allSkillEffects";
import { ModStack } from "../mod/modStack";
import { ResearchManager } from "../research/researchManager";
import { OptionsService } from "src/app/options.service";
import { Bonus } from "../bonus/bonus";

const MINE_EXP = 1.5;
const BUILDING_EXP = 2;
const CIVILIAN_SHIPS_EXP = 1.1;
const CIVILIAN_SHIPS_PRICE = 1e6;
const CIVILIAN_SHIPS_NAVCAP = -1e3;

export class ResourceManager implements ISalvable {
  private static instance: ResourceManager;

  unlockedResources: Resource[];
  unlockedProdResources: Resource[];
  limitedResources: Resource[];
  allResources: Resource[];
  tierGroups: ResourceGroup[];
  unlockedTierGroups: ResourceGroup[];

  //#region Resources
  Polybees: Resource;
  Nectar: Resource;
  alloy: Resource;
  Honey: Resource;
  computing: Resource;
  habitableSpace: Resource;
  miningDistrict: Resource;
  NectarDistrict: Resource;
  BeeFactory: Resource;
  Bee: Resource;
  navalCap: Resource;
  inactiveDarkMatter: Resource;
  missile: Resource;

  PolybeesX1: Resource;
  NectarX1: Resource;
  alloyX1: Resource;
  HoneyX1: Resource;
  computingX1: Resource;
  shipyardX1: Resource;
  shipyardProgress: Resource;
  searchX1: Resource;
  searchProgress: Resource;
  warriorX1: Resource;
  missileX1: Resource;

  PolybeesM: Resource;
  NectarM: Resource;
  HoneyM: Resource;
  scienceM: Resource;
  computingM: Resource;

  terraformer: Resource;
  scienceShip: Resource;
  solarSatellite: Resource;
  beamSatellite: Resource;

  // #endregion
  //#region group
  materials: Resource[];
  districts: Resource[];
  matGroup: ResourceGroup;
  tier1: Resource[];
  tier2: Resource[];
  matNav: Resource[];
  civilianShips: Resource[];

  limited: Resource[];
  //#endregion

  unitZero: Resource;
  unitZero2: Resource;
  maxTime: number = Number.POSITIVE_INFINITY;

  constructor() {
    ResourceManager.instance = this;

    //#region Materials
    this.Polybees = new Resource("m");
    this.Polybees.shape = "Polybees";
    this.Polybees.unlocked = true;

    this.Nectar = new Resource("c");
    this.Nectar.shape = "Nectar";
    this.Nectar.unlocked = true;

    this.alloy = new Resource("a");
    this.alloy.shape = "alloy";

    this.Honey = new Resource("e");
    this.Honey.shape = "Honey";
    this.Honey.isLimited = true;
    this.Honey.workerPerMine = new Decimal(100);

    this.computing = new Resource("f");
    this.computing.shape = "computing";

    this.shipyardProgress = new Resource("SP");
    this.shipyardProgress.shape = "cog";

    this.searchProgress = new Resource("XP");
    this.searchProgress.shape = "radar";

    this.navalCap = new Resource("n");
    this.navalCap.shape = "ship";

    this.inactiveDarkMatter = new Resource("d");
    this.inactiveDarkMatter.shape = "darkMatter";

    this.PolybeesM = new Resource("mM");
    this.NectarM = new Resource("cM");
    this.HoneyM = new Resource("eM");
    this.scienceM = new Resource("sM");
    this.computingM = new Resource("xM");

    this.missile = new Resource("i");
    this.missile.shape = "missile";

    this.terraformer = new Resource("te");
    this.scienceShip = new Resource("sc");
    this.solarSatellite = new Resource("ss");
    this.beamSatellite = new Resource("bs");
    //#endregion
    //#region Declarations

    //      Polybees
    this.PolybeesX1 = new Resource("m1");
    this.PolybeesX1.unlocked = true;
    this.PolybeesX1.quantity = new Decimal(1);
    this.Polybees.addGenerator(this.PolybeesX1);
    this.Honey.addGenerator(this.PolybeesX1, -1);

    //      Nectar
    this.NectarX1 = new Resource("c1");
    this.NectarX1.unlocked = true;
    this.NectarX1.quantity = new Decimal(1);
    this.Nectar.addGenerator(this.NectarX1, 0.7);
    this.Honey.addGenerator(this.NectarX1, -1);

    //      Alloy
    this.alloyX1 = new Resource("a1");
    this.alloy.addGenerator(this.alloyX1);
    this.Polybees.addGenerator(this.alloyX1, -3);
    this.Nectar.addGenerator(this.alloyX1, -2);
    this.Honey.addGenerator(this.alloyX1, -1);

    //      Honey
    this.Honey.unlocked = true;
    this.Honey.quantity = new Decimal(1);
    this.HoneyX1 = new Resource("e1");
    this.HoneyX1.unlocked = true;
    this.HoneyX1.quantity = new Decimal(3);
    this.Honey.addGenerator(this.HoneyX1, 2);

    //      Computing
    this.computingX1 = new Resource("f1");
    this.computing.addGenerator(this.computingX1);
    this.Honey.addGenerator(this.computingX1, -1);

    //      Shipyard
    this.shipyardX1 = new Resource("S1");
    this.shipyardProgress.addGenerator(this.shipyardX1);
    this.alloy.addGenerator(this.shipyardX1, -1);
    this.Honey.addGenerator(this.shipyardX1, -1);

    //      Search
    this.searchX1 = new Resource("X1");
    this.searchProgress.addGenerator(this.searchX1);
    this.Honey.addGenerator(this.searchX1, -1);
    this.computing.addGenerator(this.searchX1, -1);

    //      Warrior
    this.warriorX1 = new Resource("W1");
    this.navalCap.addGenerator(this.warriorX1);
    this.Honey.addGenerator(this.warriorX1, -0.5);
    this.computing.addGenerator(this.warriorX1, -0.5);

    //  Bee
    this.Bee = new Resource("D");
    this.Bee.shape = "robot";
    this.Bee.workerPerMine = new Decimal(50);
    this.BeeFactory = new Resource("F");
    this.Bee.addGenerator(this.BeeFactory, 0.01);
    this.alloy.addGenerator(this.BeeFactory, -100);
    this.Honey.addGenerator(this.BeeFactory, -20);

    //      Missile
    this.missileX1 = new Resource("i1");
    this.missile.addGenerator(this.missileX1, 0.01);
    this.alloy.addGenerator(this.missileX1, -1);
    this.Honey.addGenerator(this.missileX1, -0.5);

    //      Space
    this.habitableSpace = new Resource("hs");
    this.habitableSpace.shape = "world";
    this.miningDistrict = new Resource("md");
    this.miningDistrict.shape = "miningD";
    this.NectarDistrict = new Resource("cd");
    this.NectarDistrict.shape = "NectarD";
    this.districts = [
      this.habitableSpace,
      this.miningDistrict,
      this.NectarDistrict
    ];
    this.districts.forEach(d => {
      d.unlocked = true;
    });

    //#endregion
    //#region Group
    this.materials = [
      this.Polybees,
      this.Nectar,
      this.Honey,
      this.computing,
      this.alloy,
      this.shipyardProgress,
      this.searchProgress,
      this.Bee,
      this.navalCap,
      this.missile
    ];
    this.tier1 = [
      this.PolybeesX1,
      this.NectarX1,
      this.HoneyX1,
      this.computingX1,
      this.alloyX1,
      this.shipyardX1,
      this.warriorX1,
      this.searchX1
    ];
    this.tier2 = [
      this.BeeFactory,
      this.PolybeesM,
      this.NectarM,
      this.HoneyM,
      this.computingM,
      this.scienceM,
      this.missileX1
    ];
    this.civilianShips = [
      this.terraformer,
      this.scienceShip,
      this.solarSatellite,
      this.beamSatellite
    ];
    //#endregion
    //#region Buy
    this.PolybeesX1.generateBuyAction(
      new MultiPrice([new Price(this.Polybees, 80), new Price(this.Nectar, 20)])
    );
    this.NectarX1.generateBuyAction(
      new MultiPrice([new Price(this.Polybees, 80), new Price(this.Nectar, 40)])
    );
    this.PolybeesX1.buyAction.afterBuy = this.unlockComputing.bind(this);
    this.NectarX1.buyAction.afterBuy = this.unlockComputing.bind(this);

    this.alloyX1.generateBuyAction(
      new MultiPrice([new Price(this.Polybees, 80), new Price(this.Nectar, 60)])
    );
    this.HoneyX1.generateBuyAction(
      new MultiPrice([new Price(this.Polybees, 80), new Price(this.Nectar, 60)])
    );
    this.computingX1.generateBuyAction(
      new MultiPrice([new Price(this.Polybees, 60), new Price(this.Nectar, 120)])
    );
    this.shipyardX1.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 50),
        new Price(this.Polybees, 100),
        new Price(this.Nectar, 25)
      ])
    );
    this.searchX1.generateBuyAction(
      new MultiPrice([new Price(this.alloy, 100), new Price(this.Nectar, 200)])
    );
    this.warriorX1.generateBuyAction(
      new MultiPrice([new Price(this.alloy, 200)])
    );

    //
    //  Buildings
    //
    this.BeeFactory.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.habitableSpace, 1, BUILDING_EXP)
      ])
    );
    this.missileX1.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.habitableSpace, 1, BUILDING_EXP)
      ])
    );
    this.PolybeesM.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.Nectar, 1e4, BUILDING_EXP),
        new Price(this.habitableSpace, 10, BUILDING_EXP)
      ])
    );
    this.PolybeesX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(this.PolybeesM, 1, true)
    );
    this.NectarM.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.Nectar, 1e4, BUILDING_EXP),
        new Price(this.habitableSpace, 10, BUILDING_EXP)
      ])
    );
    this.NectarX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(this.NectarM, 1, true)
    );
    this.HoneyM.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.Nectar, 1e4, BUILDING_EXP),
        new Price(this.habitableSpace, 10, BUILDING_EXP)
      ])
    );
    this.HoneyX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(this.HoneyM, 1, true)
    );
    this.scienceM.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.Nectar, 1e4, BUILDING_EXP),
        new Price(this.habitableSpace, 10, BUILDING_EXP)
      ])
    );
    this.computingM.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.Nectar, 1e4, BUILDING_EXP),
        new Price(this.habitableSpace, 10, BUILDING_EXP)
      ])
    );
    this.computingX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(this.computingM, 1, true)
    )

    //
    //  Civilian Ships
    //
    ;[
      this.terraformer,
      this.scienceShip,
      this.solarSatellite,
      this.beamSatellite
    ].forEach(s => {
      s.generateBuyAction(
        new MultiPrice([
          new Price(this.alloy, CIVILIAN_SHIPS_PRICE, CIVILIAN_SHIPS_EXP)
        ])
      );
      this.navalCap.addGenerator(s, CIVILIAN_SHIPS_NAVCAP);
      s.getQuantity = () => {
        return s.quantity.times(s.operativity / 100);
      };
    });
    this.HoneyX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(this.solarSatellite, 0.05)
    );

    //#endregion
    //#region Mine
    //  Polybees Mine
    const buyPolybeesMine = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 1000, MINE_EXP),
        new Price(this.Nectar, 250, MINE_EXP),
        new Price(this.miningDistrict, 1, MINE_EXP)
      ])
    );
    buyPolybeesMine.afterBuy = () => {
      this.PolybeesX1.reloadLimit();
    };
    buyPolybeesMine.name = "Polybees Mine";
    buyPolybeesMine.description =
      "A Polybees Mine allows you to buy more mining Bees";
    this.PolybeesX1.actions.push(buyPolybeesMine);
    this.PolybeesX1.limitStorage = buyPolybeesMine;
    this.PolybeesX1.prestigeLimit = AllSkillEffects.PLUS_Polybees_MINER;

    //  Nectar Mine
    const buyNectarMine = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 1000, MINE_EXP),
        new Price(this.Nectar, 500, MINE_EXP),
        new Price(this.NectarDistrict, 1, MINE_EXP)
      ])
    );
    buyNectarMine.afterBuy = () => {
      this.NectarX1.reloadLimit();
    };
    buyNectarMine.name = "Nectar Mine";
    buyNectarMine.description =
      "An Nectar Mine allows you to buy more Nectar Bees";
    this.NectarX1.actions.push(buyNectarMine);
    this.NectarX1.limitStorage = buyNectarMine;
    this.NectarX1.prestigeLimit = AllSkillEffects.PLUS_Nectar_MINER;

    //  Honey Plant
    const buyHoneyPlant = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 1500, MINE_EXP),
        new Price(this.Nectar, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyHoneyPlant.afterBuy = () => {
      this.HoneyX1.reloadLimit();
    };
    buyHoneyPlant.name = "Honey Plant";
    buyHoneyPlant.description =
      "An Honey Plant allows you to buy more technicians";
    this.HoneyX1.actions.push(buyHoneyPlant);
    this.HoneyX1.limitStorage = buyHoneyPlant;
    this.HoneyX1.prestigeLimit = AllSkillEffects.PLUS_Honey;

    //  Supercomputer
    const buySuperComputer = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 1500, MINE_EXP),
        new Price(this.Nectar, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buySuperComputer.afterBuy = () => {
      this.computingX1.reloadLimit();
    };
    buySuperComputer.name = "Super Computer";
    buySuperComputer.description =
      "An Super Computer allows you to buy more computing units";
    this.computingX1.actions.push(buySuperComputer);
    this.computingX1.limitStorage = buySuperComputer;
    this.computingX1.prestigeLimit = AllSkillEffects.PLUS_CPU;

    //  Alloy Foundry
    const buyFoundry = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 1000, MINE_EXP),
        new Price(this.Nectar, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyFoundry.afterBuy = () => {
      this.alloyX1.reloadLimit();
    };
    buyFoundry.name = "Alloy Foundry";
    buyFoundry.description =
      "An Alloy Foundry allows you to buy more foundry Bees";
    this.alloyX1.actions.push(buyFoundry);
    this.alloyX1.limitStorage = buyFoundry;
    this.alloyX1.prestigeLimit = AllSkillEffects.PLUS_ALLOY;

    //  Shipyard
    const buyShipyard = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 1000, MINE_EXP),
        new Price(this.Nectar, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyShipyard.afterBuy = () => {
      this.shipyardX1.reloadLimit();
    };
    buyShipyard.name = "Shipyard";
    buyShipyard.description = "A Shipyard allows you to buy more worker Bees";
    this.shipyardX1.actions.push(buyShipyard);
    this.shipyardX1.limitStorage = buyShipyard;
    this.shipyardX1.prestigeLimit = AllSkillEffects.PLUS_WORKER;

    this.shipyardProgress.reloadLimit = () => {
      const shipyard = Shipyard.getInstance();
      if (shipyard) {
        this.shipyardProgress.limit = shipyard.getTotalToDo();
        this.shipyardProgress.quantity = this.shipyardProgress.quantity.min(
          this.shipyardProgress.limit
        );
      }
      this.shipyardProgress.isCapped = this.shipyardProgress.limit.lt(0);
    };

    //  Searching
    const buyTelescope = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 1000, MINE_EXP),
        new Price(this.Nectar, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyTelescope.afterBuy = () => {
      this.searchX1.reloadLimit();
    };
    buyTelescope.name = "Telescope";
    buyTelescope.description =
      "A Telescope allows you to buy more searching Bees";
    this.searchX1.actions.push(buyTelescope);
    this.searchX1.limitStorage = buyTelescope;
    this.searchX1.prestigeLimit = AllSkillEffects.PLUS_SEARCH;

    this.searchProgress.reloadLimit = () => {
      const enemy = EnemyManager.getInstance();
      if (enemy) {
        this.searchProgress.limit = enemy.getTotalToDo();
        this.searchProgress.quantity = this.searchProgress.quantity.min(
          this.searchProgress.limit
        );
      }
      this.searchProgress.isCapped = this.searchProgress.limit.lt(0);
    };

    //  Warrior
    const buyStronghold = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 1000, MINE_EXP),
        new Price(this.Nectar, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyStronghold.afterBuy = () => {
      this.warriorX1.reloadLimit();
    };
    buyStronghold.name = "Stronghold";
    buyStronghold.description =
      "A Stronghold allows you to buy more warrior Bees";
    this.warriorX1.actions.push(buyStronghold);
    this.warriorX1.limitStorage = buyStronghold;
    this.warriorX1.prestigeLimit = AllSkillEffects.PLUS_WARRIOR;

    //  Bee
    const buyBee = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 1000, MINE_EXP),
        new Price(this.Nectar, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyBee.afterBuy = () => {
      this.Bee.reloadLimit();
    };
    buyBee.name = "Bee Depot";
    buyBee.description =
      "Bee Depots allow you to store more robots components.";
    this.Bee.exponentialStorage = true;
    this.Bee.actions.push(buyBee);
    this.Bee.limitStorage = buyBee;
    this.Bee.reloadCustomLimit = (limit: Decimal) => {
      return limit.plus(
        !this.tierGroups
          ? new Decimal(0)
          : this.tierGroups[1].unlockedResources
              .filter(r => !r.isCapped && r !== this.Bee && r.priority > 0)
              .map(r => r.limit.minus(r.quantity).times(r.standardPrice))
              .reduce((c, p) => c.plus(p), new Decimal(0))
      );
    };

    //#endregion
    //#region Storage

    //  Honey
    this.Honey.isLimited = true;
    const buyExpansion = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 500, 2),
        new Price(this.Nectar, 1000, 2),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyExpansion.afterBuy = () => {
      this.Honey.reloadLimit();
    };
    buyExpansion.name = "Batteries";
    buyExpansion.description = "Batteries allow you to store more Honey.";
    this.Honey.actions.push(buyExpansion);
    this.Honey.limitStorage = buyExpansion;
    this.Honey.exponentialStorage = true;
    this.Honey.alwaysActive = true;
    this.Honey.workerPerMine = new Decimal(500);

    //  Missile
    this.missile.isLimited = true;
    const missileSilo = new Action(
      "L",
      new MultiPrice([
        new Price(this.Polybees, 5000, 2),
        new Price(this.Nectar, 10000, 2),
        new Price(this.habitableSpace, 5, MINE_EXP)
      ])
    );
    missileSilo.afterBuy = () => {
      this.missile.reloadLimit();
    };
    missileSilo.name = "Missile Silo";
    this.missile.actions.push(missileSilo);
    this.missile.limitStorage = missileSilo;
    this.missile.exponentialStorage = true;
    this.missile.workerPerMine = new Decimal(1000);
    //#endregion
    //#region Arrays
    this.limited = [
      // this.Polybees,
      // this.Nectar,
      // this.alloy,
      this.PolybeesX1,
      this.NectarX1,
      this.alloyX1,
      this.HoneyX1,
      this.computingX1,
      this.Honey,
      this.shipyardProgress,
      this.shipyardX1,
      this.searchX1,
      this.searchProgress,
      this.warriorX1,
      this.Bee,
      this.missile
    ];

    this.allResources = [
      this.Polybees,
      this.Nectar,
      this.alloy,
      this.Honey,
      this.computing,
      this.PolybeesX1,
      this.NectarX1,
      this.HoneyX1,
      this.alloyX1,
      this.computingX1,
      this.habitableSpace,
      this.miningDistrict,
      this.NectarDistrict,
      this.shipyardX1,
      this.shipyardProgress,
      this.searchX1,
      this.searchProgress,
      this.warriorX1,
      this.Bee,
      this.BeeFactory,
      this.navalCap,
      this.inactiveDarkMatter,
      this.PolybeesM,
      this.NectarM,
      this.HoneyM,
      this.scienceM,
      this.computingM,
      this.missile,
      this.missileX1,
      this.terraformer,
      this.scienceShip,
      this.solarSatellite,
      this.beamSatellite
    ];
    this.allResources.forEach(r => r.generateRefundActions());
    this.matGroup = new ResourceGroup(
      "0",
      "Materials",
      "objects",
      this.materials
    );
    this.tierGroups = [
      this.matGroup,
      new ResourceGroup("1", "Robots", "robot", this.tier1),
      new ResourceGroup("2", "Buildings", "building", this.tier2),
      new ResourceGroup("5", "Civilian Ships", "satellite", this.civilianShips),
      new ResourceGroup("4", "Districts", "world", this.districts)
    ];
    this.tierGroups[0].action1Name = "Buy Storage";
    this.tierGroups[1].action1Name = "Buy Robots";
    this.tierGroups[1].action2Name = "Increase Robot Storage";
    this.tierGroups[2].action1Name = "Buy Buildings";
    this.tierGroups[3].action1Name = "Buy Civilian Ships";

    this.tier1.forEach(t => {
      t.showPriority = true;
    });

    this.reloadList();
    //#endregion
    //#region Info Messages
    this.PolybeesX1.alerts = [
      {
        id: "1",
        getType: () => "info",
        getMessage: () => "Buy five or more to unlock new stuff",
        getCondition: () => ResourceManager.getInstance().PolybeesX1.quantity.lt(5)
      }
    ];
    this.NectarX1.alerts = [
      {
        id: "2",
        getType: () => "info",
        getMessage: () => "Buy five or more to unlock new stuff",
        getCondition: () =>
          ResourceManager.getInstance().NectarX1.quantity.lt(5)
      }
    ];
    this.warriorX1.alerts = [
      {
        id: "3",
        getType: () => "info",
        getMessage: () =>
          ResourceManager.getInstance().warriorX1.name +
          " are granting + " +
          MainService.formatPipe.transform(
            FleetManager.getInstance().getNavalCapacityFromBees(),
            true
          ) +
          " naval capacity",
        getCondition: () =>
          ResourceManager.getInstance().warriorX1.quantity.gte(1)
      },
      {
        id: "4",
        getType: () => "warning",
        getMessage: () => "Ship Quantity is hard limited to 10k",
        getCondition: () => OptionsService.navalCapNotification
      }
    ];
    this.navalCap.alerts = [
      {
        id: "4",
        getType: () => "warning",
        getMessage: () => "Ship Quantity is hard limited to 10k",
        getCondition: () => true
      }
    ];
    //#endregion
    //#region Mods
    this.tier1.forEach(r => {
      r.modStack = new ModStack();
      r.modStack.generateMods(r);
    });
    //#endregion
    this.limited.forEach(rl => {
      rl.isLimited = true;
      rl.reloadLimit();
    });
  }
  static getInstance() {
    return ResourceManager.instance;
  }
  /**
   *  Reload lists of unlocked resources
   */
  reloadList(): void {
    this.unlockedResources = this.allResources.filter(r => r.unlocked);
    this.unlockedProdResources = this.unlockedResources.filter(
      r => r.generators.length > 0 || r.products.length > 0
    );
    this.limitedResources = this.limited.filter(r => r.unlocked);
    this.tierGroups.forEach(tg => tg.reload());
    this.unlockedTierGroups = this.tierGroups.filter(
      u => u.unlockedResources.length > 0
    );
    this.matNav = [
      this.Polybees,
      this.Nectar,
      this.alloy,
      this.Honey,
      this.computing
    ].filter(m => m.unlocked);
  }
  /**
   *  Calculate polynomial grow
   */
  loadPolynomial(): void {
    this.shipyardProgress.reloadLimit();
    this.searchProgress.reloadLimit();
    this.unlockedProdResources.forEach(res => {
      res.reloadProd();
    });

    for (const unit of this.unlockedProdResources) {
      unit.c = new Decimal(0);

      for (const prod1 of unit.generators.filter(p => p.producer.isActive())) {
        const prodX = prod1.prodPerSec;
        unit.c = unit.c.plus(prodX.times(prod1.producer.quantity));
      }
    }
  }
  /**
   *  Calculate times to end
   */
  loadEndTime(): number {
    this.maxTime = Number.POSITIVE_INFINITY;
    this.unitZero = null;
    this.unitZero2 = null;

    //  Reset
    this.unlockedProdResources.forEach(unit => {
      unit.endIn = Number.POSITIVE_INFINITY;
      unit.isEnding = false;
      unit.fullIn = Number.POSITIVE_INFINITY;
    });

    //  Load end times
    this.unlockedProdResources.forEach(unit => {
      const d = unit.quantity;
      if (unit.c.lt(0)) {
        const min = d.div(unit.c.abs()).max(0);
        if (this.maxTime > min.toNumber()) {
          this.maxTime = min.toNumber();
          this.unitZero = unit;
        }
        unit.endIn = Math.min(min.times(1000).toNumber(), unit.endIn);
        unit.isEnding = true;
      }
    });

    //  Load full times
    this.limitedResources
      .filter(r => !r.isCapped && !r.isEnding)
      .forEach(unit => {
        const d = unit.limit.minus(unit.quantity);
        if (unit.c.gt(0)) {
          const min = d.div(unit.c);
          if (this.maxTime > min.toNumber()) {
            this.maxTime = min.toNumber();
            this.unitZero = null;
            this.unitZero2 = unit;
          }
          unit.fullIn = Math.min(min.times(1000).toNumber(), unit.fullIn);
        }
      });

    //  Fix Computing
    if (this.unitZero === this.computing && this.computing.c.gte(0)) {
      this.maxTime = Number.POSITIVE_INFINITY;
      this.computing.isEnding = false;
      this.unitZero = null;
    }

    // console.log(
    //   this.unitZero.name +
    //     " " +
    //     this.unitZero.endIn +
    //     " " +
    //     this.unitZero.fullIn
    // );
    return this.maxTime;
  }
  /**
   * Update resources
   *
   * @param  seconds in seconds
   */
  update(seconds: number): void {
    this.unlockedResources
      .filter(u => !u.c.eq(0))
      .forEach(u => {
        u.quantity = u.quantity.plus(u.c.times(seconds));
      });
    this.unlockedResources
      .filter(u => u.quantity.lt(0))
      .forEach(u => {
        // u.quantity = new Decimal(0);
      });
  }
  /**
   * Stop consumers and producers of consumers of resource that have been ended
   */
  stopResource() {
    if (this.unitZero && this.unitZero.isEnding) {
      //  Stop consumers
      this.unitZero.generators
        .filter(p => p.producer.quantity.gt(0) && p.ratio.lt(0))
        .forEach(p => {
          p.producer.operativity = 0;
        });
      this.unitZero.isEnding = false;
    }
    if (this.unitZero2) {
      this.unitZero2.isCapped = true;
      this.unitZero2.quantity = this.unitZero2.limit;
    }
  }
  /**
   *  Reload prices and what player can buy
   */
  reloadActions() {
    this.unlockedResources.forEach(res => {
      res.actions.forEach(act => act.reload());
    });
  }

  /**
   *  Unlock computing if PolybeesX1 and NectarX1 are >=5
   */
  unlockComputing() {
    if (
      !this.computing.unlocked &&
      this.PolybeesX1.quantity.gte(5) &&
      this.NectarX1.quantity.gte(5)
    ) {
      const unl = this.computing.unlock();
      this.computingX1.unlock();
      if (unl) {
        ResearchManager.getInstance().isNew = true;
        if (OptionsService.researchModal) {
          ResearchManager.getInstance().isNewModal = true;
        }
        MainService.toastr.info("Research tab unlocked");
      }
    }
  }

  /**
   * Deploy robots to jobs
   * Based on priority
   */
  deployBees() {
    const jobs = this.tierGroups[1].unlockedResources.filter(
      j => !j.isCapped && j !== this.Bee
    );
    jobs.forEach(j => {
      j.realPriority = j.limit
        .minus(j.quantity)
        .floor()
        .times(j.priority);
    });
    const totalPriority = jobs
      .map(j => j.realPriority)
      .reduce((p, c) => p.plus(c), new Decimal());
    jobs.sort((a, b) => b.realPriority.cmp(a.realPriority));
    let toDeploy = this.Bee.quantity;
    let n = 0;
    while (toDeploy.gte(0) && n < jobs.length) {
      const job = jobs[n];
      if (job.priority > 0) {
        const toAddMax = job.limit.minus(job.quantity).floor();
        const toAddPrior = toDeploy
          .times(job.realPriority)
          .div(job.standardPrice)
          .div(totalPriority)
          .floor();
        const toAdd = Decimal.min(toAddMax, toAddPrior).floor();
        if (toAdd.gte(1)) {
          job.quantity = job.quantity.plus(toAdd);
          const price = toAdd.times(job.standardPrice);
          toDeploy = toDeploy.minus(price);
          this.Bee.quantity = this.Bee.quantity.minus(price);
        }
      }
      n++;
    }
    //  If everything round to zero no robots are deployed
    //  I fix this by deploy on high priority job
    if (toDeploy.gte(0) && jobs.length > 0 && jobs[0].priority > 0) {
      const job = jobs[0];
      const toAddMax = job.limit.minus(job.quantity).floor();
      const toAdd = toAddMax
        .div(job.standardPrice)
        .min(toDeploy.div(job.standardPrice))
        .floor();
      if (toAdd.gte(1)) {
        job.quantity = job.quantity.plus(toAdd);
        const price = toAdd.times(job.standardPrice);
        toDeploy = toDeploy.minus(price);
        this.Bee.quantity = this.Bee.quantity.minus(price);
      }
    }
    this.Bee.reloadLimit();
  }

  //#region Save and load
  getSave(): any {
    const data: any = {};
    data.r = this.unlockedResources.map(r => r.getSave());
    return data;
  }
  load(data: any): boolean {
    if (!("r" in data && isArray(data.r))) return false;
    this.allResources.forEach(r => r.reset());

    for (const res of data.r) {
      const resource = this.allResources.find(u => u.id === res.i);
      if (resource) resource.load(res);
      // console.log("Res: " + resource.name + " " + resource.quantity.toNumber());
    }

    [this.PolybeesX1, this.Nectar, this.HoneyX1].forEach(r => {
      r.quantity = r.quantity.max(1);
    });

    this.reloadList();
    this.limited.forEach(rl => {
      rl.reloadLimit();
    });
    return true;
  }
  //#endregion
}
