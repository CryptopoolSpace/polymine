import { SkillEffect } from "./skillEffects";
import { ResourceManager } from "../resource/resourceManager";
import { Bonus } from "../bonus/bonus";
import { Miners } from "../Miners";
import { MainService } from "src/app/main.service";
import { SkillGroup } from "./skillGroup";

export const PLUS_ADD = 10;
export const SkillGroups: SkillGroup[] = [
  {
    id: "1",
    name: "1- Basics",
    maxPercent: 1,
    skills: []
  },
  {
    id: "2",
    name: "2- Advanced Production",
    maxPercent: 0.3,
    skills: []
  },
  {
    id: "3",
    name: "3- Modding",
    maxPercent: 0.15,
    skills: []
  },
  {
    id: "S",
    name: "4- Special",
    maxPercent: 0.1,
    skills: []
  }
];

export class AllSkillEffects {
  static effectList = new Array<SkillEffect>();

  //#region start
  static readonly Bee_MULTI = new SkillEffect(9, "1", 3);
  static readonly DOUBLE_BATTLE_GAIN = new SkillEffect(14, "1", 5);
  static readonly FAST_COMBAT = new SkillEffect(10, "1", 1);
  //#endregion
  //#region Limit increase
  static readonly PLUS_Polybees_MINER = new SkillEffect(0, "1");
  static readonly PLUS_Nectar_MINER = new SkillEffect(1, "1");
  static readonly PLUS_Honey = new SkillEffect(2, "1");
  static readonly PLUS_wax = new SkillEffect(3, "1");
  static readonly PLUS_CPU = new SkillEffect(4, "1");
  static readonly PLUS_WORKER = new SkillEffect(5, "1");
  static readonly PLUS_SEARCH = new SkillEffect(6, "1");
  static readonly PLUS_WARRIOR = new SkillEffect(7, "1");
  // static readonly PLUS_Hive = new SkillEffect(8, "1");

  //#endregion
  //#region Combat
  static readonly DOUBLE_NAVAL_CAPACITY = new SkillEffect(11, "S", 1);
  static readonly DOUBLE_DARK_MATTER = new SkillEffect(12, "S", 2);
  static readonly MODULE_LEVEL = new SkillEffect(13, "S", 2);
  static readonly DOUBLE_MISSILE = new SkillEffect(15, "S", 3);
  static readonly MULTI_FACTORY = new SkillEffect(16, "2");
  static readonly TILE_MERGE = new SkillEffect(40, "S", 2);
  //#endregion
  //#region BeesBot Modding
  static readonly FACTORY_BONUS = new SkillEffect(17, "2", 3);
  static readonly MODDING_PLUS = new SkillEffect(18, "S", 5);
  static readonly DOUBLE_MODDING = new SkillEffect(19, "S", 2);

  static readonly MOD_Polybees_MINER = new SkillEffect(20, "3");
  static readonly MOD_Nectar_MINER = new SkillEffect(21, "3");
  static readonly MOD_Honey = new SkillEffect(22, "3");
  static readonly MOD_wax = new SkillEffect(23, "3");
  static readonly MOD_CPU = new SkillEffect(24, "3");
  static readonly MOD_WORKER = new SkillEffect(25, "3");
  static readonly MOD_SEARCH = new SkillEffect(26, "3");
  // static readonly MOD_WARRIOR = new SkillEffect(27, "3");
  //#endregion
  //#region Search
  static readonly SEARCH_MULTI = new SkillEffect(28, "2");
  static readonly SEARCH_Polybees = new SkillEffect(29, "S", 1);
  static readonly SEARCH_CRY = new SkillEffect(30, "S", 1);
  static readonly SEARCH_HAB = new SkillEffect(31, "S", 1);
  static readonly SEARCH_HAB2 = new SkillEffect(32, "S", 1);
  static readonly SEARCH_RANDOM = new SkillEffect(33, "S", 1);
  static readonly DOUBLE_DISTRICTS = new SkillEffect(34, "S", 5);
  static readonly SEARCH_BeesBot = new SkillEffect(41, "S", 1);
  //#endregion
  //#region Resource Gain Multi
  static readonly Honey_MULTI = new SkillEffect(35, "2");
  static readonly wax_MULTI = new SkillEffect(36, "2");
  static readonly COMPUTING_MULTI = new SkillEffect(37, "2");
  static readonly SHIPYARD_MULTI = new SkillEffect(38, "2");
  static readonly RESEARCH_MULTI = new SkillEffect(39, "2");
  //#endregion

  static initialize(prestige = false) {
    const resMan = ResourceManager.getInstance();

    //#region Tier 1
    const resources = [
      resMan.Polybees,
      resMan.Nectar,
      resMan.Honey,
      resMan.computing,
      resMan.wax,
      resMan.shipyardProgress,
      resMan.searchProgress
    ];
    const workers = [
      resMan.PolybeesX1,
      resMan.NectarX1,
      resMan.HoneyX1,
      resMan.computingX1,
      resMan.waxX1,
      resMan.shipyardX1,
      resMan.searchX1
    ];
    const tier1 = [
      AllSkillEffects.PLUS_Polybees_MINER,
      AllSkillEffects.PLUS_Nectar_MINER,
      AllSkillEffects.PLUS_Honey,
      AllSkillEffects.PLUS_CPU,
      AllSkillEffects.PLUS_wax,
      AllSkillEffects.PLUS_WORKER,
      AllSkillEffects.PLUS_SEARCH
    ];
    const mods = [
      AllSkillEffects.MOD_Polybees_MINER,
      AllSkillEffects.MOD_Nectar_MINER,
      AllSkillEffects.MOD_Honey,
      AllSkillEffects.MOD_CPU,
      AllSkillEffects.MOD_wax,
      AllSkillEffects.MOD_WORKER,
      AllSkillEffects.MOD_SEARCH
    ];
    AllSkillEffects.Bee_MULTI.getDescription = (num = 1) => {
      return (
        "Bees yield and consume " +
        MainService.formatPipe.transform(150 * num, true) +
        "% more resource"
      );
    };
    AllSkillEffects.Bee_MULTI.name = "Bee Prestige";
    resMan.warriorX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.Bee_MULTI, 1.5)
    );
    for (let i = 0; i < 7; i++) {
      tier1[i].shape = resources[i].shape;
      tier1[i].getDescription = (num = 1) => {
        return (
          "+ " +
          MainService.formatPipe.transform(PLUS_ADD * num, true) +
          " " +
          workers[i].name +
          "  / " +
          workers[i].actions[1].name +
          ", +" +
          MainService.formatPipe.transform(50 * num, true) +
          "% " +
          workers[i].name +
          " output"
        );
      };
      tier1[i].name = workers[i].name + " Prestige";
      workers[i].productionMultiplier.multiplicativeBonus.push(
        new Bonus(tier1[i], 0.5, true)
      );
      workers[i].productionMultiplier.multiplicativeBonus.push(
        new Bonus(AllSkillEffects.Bee_MULTI, 1.5)
      );

      mods[i].getDescription = (num = 1) => {
        return (
          "+ " +
          MainService.formatPipe.transform(10 * num, true) +
          " " +
          workers[i].name +
          " mods"
        );
      };
      workers[i].modPrestige = mods[i];
    }
    tier1.forEach(e => {
      e.afterBuy = () => {
        ResourceManager.getInstance().limitedResources.forEach(r =>
          r.reloadLimit()
        );
      };
    });

    //#endregion
    //#region PLUS_WARRIOR
    AllSkillEffects.PLUS_WARRIOR.shape = "ship";
    AllSkillEffects.PLUS_WARRIOR.getDescription = (num = 1) => {
      return (
        "+" +
        MainService.formatPipe.transform(PLUS_ADD * num, true) +
        " " +
        resMan.warriorX1.name +
        " / " +
        resMan.warriorX1.actions[1].name
      );
    };
    AllSkillEffects.PLUS_WARRIOR.afterBuy = () => {
      ResourceManager.getInstance().limitedResources.forEach(r =>
        r.reloadLimit()
      );
    };
    //#endregion
    //#region Combat
    AllSkillEffects.FAST_COMBAT.limit = new Decimal(1);
    AllSkillEffects.FAST_COMBAT.isLimited = true;
    AllSkillEffects.FAST_COMBAT.getDescription = (num = 1) => {
      return "+ " + MainService.formatPipe.transform(0.25 * num) + " tile /s";
    };
    AllSkillEffects.DOUBLE_NAVAL_CAPACITY.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num, true) +
        "% naval capacity"
      );
    };
    AllSkillEffects.DOUBLE_DARK_MATTER.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(200 * num, true) +
        "% Dark Matter"
      );
    };
    AllSkillEffects.MODULE_LEVEL.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(100 * num, true) +
        "% Ship Module Level"
      );
    };
    AllSkillEffects.DOUBLE_BATTLE_GAIN.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(200 * num, true) +
        "% Resource gain from battle"
      );
    };
    AllSkillEffects.DOUBLE_MISSILE.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(250 * num, true) +
        "% Damage from missiles"
      );
    };
    AllSkillEffects.DOUBLE_MISSILE.name = "Missile Prestige";
    AllSkillEffects.MULTI_FACTORY.getDescription = (num = 1) => {
      return (
        "Missile Factory yield and consume " +
        MainService.formatPipe.transform(250 * num, true) +
        "% more resource"
      );
    };
    AllSkillEffects.MULTI_FACTORY.name = "Missile Factory Prestige";
    resMan.missileX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.MULTI_FACTORY, 2.5)
    );

    AllSkillEffects.TILE_MERGE.limit = new Decimal(2);
    AllSkillEffects.TILE_MERGE.isLimited = true;
    AllSkillEffects.TILE_MERGE.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(20 * num, true) + "% tile /s"
      );
    };
    //#endregion
    //#region BeesBot Modding
    AllSkillEffects.FACTORY_BONUS.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(500 * num, true) +
        "% " +
        resMan.BeeFactory.name +
        " output"
      );
    };
    ResourceManager.getInstance().BeeFactory.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.FACTORY_BONUS, 5, true)
    );
    AllSkillEffects.FACTORY_BONUS.name = "BeesBot Factory Prestige";

    AllSkillEffects.MODDING_PLUS.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(5 * num, true) +
        " Modding points"
      );
    };

    AllSkillEffects.DOUBLE_MODDING.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num, true) +
        "% Modding points"
      );
    };
    //#endregion
    //#region Search
    AllSkillEffects.SEARCH_MULTI.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(300 * num, true) + "% Searching"
      );
    };
    AllSkillEffects.SEARCH_MULTI.name = "Prestige search multi";
    resMan.searchX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.SEARCH_MULTI, 3, true)
    );

    AllSkillEffects.SEARCH_Polybees.limit = new Decimal(1);
    AllSkillEffects.SEARCH_Polybees.isLimited = true;
    AllSkillEffects.SEARCH_Polybees.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num, true) +
        "% Searching, can search for Polybees district"
      );
    };
    AllSkillEffects.SEARCH_Polybees.name = "Prestige search Polybees";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_Polybees, 0.5, true)
    );

    AllSkillEffects.SEARCH_CRY.limit = new Decimal(1);
    AllSkillEffects.SEARCH_CRY.isLimited = true;
    AllSkillEffects.SEARCH_CRY.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num, true) +
        "% Searching, can search for Nectar district"
      );
    };
    AllSkillEffects.SEARCH_CRY.name = "Prestige search Nectar";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_CRY, 0.5, true)
    );

    AllSkillEffects.SEARCH_HAB.limit = new Decimal(1);
    AllSkillEffects.SEARCH_HAB.isLimited = true;
    AllSkillEffects.SEARCH_HAB.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num, true) +
        "% Searching, can search for Trees"
      );
    };
    AllSkillEffects.SEARCH_HAB.name = "Prestige search Trees";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_HAB, 0.5, true)
    );

    AllSkillEffects.SEARCH_HAB2.limit = new Decimal(1);
    AllSkillEffects.SEARCH_HAB2.isLimited = true;
    AllSkillEffects.SEARCH_HAB2.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num, true) +
        "% Searching, can search for even more Trees"
      );
    };
    AllSkillEffects.SEARCH_HAB2.name = "Prestige search Trees 2";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_HAB2, 0.5, true)
    );

    AllSkillEffects.SEARCH_RANDOM.limit = new Decimal(1);
    AllSkillEffects.SEARCH_RANDOM.isLimited = true;
    AllSkillEffects.SEARCH_RANDOM.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num, true) +
        "% Searching, can search for randomized districts"
      );
    };
    AllSkillEffects.SEARCH_RANDOM.name = "Prestige search random";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_RANDOM, 0.5, true)
    );

    AllSkillEffects.DOUBLE_DISTRICTS.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(100 * num, true) +
        "% districts gain"
      );
    };

    AllSkillEffects.SEARCH_BeesBot.limit = new Decimal(1);
    AllSkillEffects.SEARCH_BeesBot.isLimited = true;
    AllSkillEffects.SEARCH_BeesBot.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num, true) +
        "% Searching, can search for BeesBot c."
      );
    };
    AllSkillEffects.SEARCH_BeesBot.name = "Prestige search BeesBot c.";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_BeesBot, 0.5, true)
    );
    //#endregion
    //#region Gain Multi
    AllSkillEffects.Honey_MULTI.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(200 * num, true) + "%  Honey"
      );
    };
    AllSkillEffects.Honey_MULTI.name = "Prestige Honey multi";
    resMan.HoneyX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.Honey_MULTI, 2, true)
    );

    AllSkillEffects.wax_MULTI.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(200 * num, true) + "%  wax"
      );
    };
    AllSkillEffects.wax_MULTI.name = "Prestige wax multi";
    resMan.waxX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.wax_MULTI, 2, true)
    );

    AllSkillEffects.COMPUTING_MULTI.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(200 * num, true) + "% Computing"
      );
    };
    AllSkillEffects.COMPUTING_MULTI.name = "Prestige computing multi";
    resMan.computingX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.COMPUTING_MULTI, 2, true)
    );

    AllSkillEffects.SHIPYARD_MULTI.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(200 * num, true) +
        "% Shipyard Progress"
      );
    };
    AllSkillEffects.SHIPYARD_MULTI.name = "Prestige Shipyard Progress multi";
    resMan.shipyardX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.SHIPYARD_MULTI, 2, true)
    );

    AllSkillEffects.RESEARCH_MULTI.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(300 * num, true) + "% Research"
      );
    };
    AllSkillEffects.RESEARCH_MULTI.name = "Prestige Research multi";
    Miners.getInstance().researchBonus.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.RESEARCH_MULTI, 3, true)
    );
    //#endregion

    AllSkillEffects.effectList = [
      AllSkillEffects.Bee_MULTI,
      AllSkillEffects.PLUS_Polybees_MINER,
      AllSkillEffects.PLUS_Nectar_MINER,
      AllSkillEffects.PLUS_wax,
      AllSkillEffects.PLUS_Honey,
      AllSkillEffects.PLUS_CPU,
      AllSkillEffects.PLUS_WORKER,
      AllSkillEffects.PLUS_SEARCH,
      AllSkillEffects.PLUS_WARRIOR,
      AllSkillEffects.FAST_COMBAT,
      AllSkillEffects.DOUBLE_NAVAL_CAPACITY,
      AllSkillEffects.FACTORY_BONUS,
      AllSkillEffects.MODDING_PLUS,
      AllSkillEffects.SEARCH_MULTI,
      AllSkillEffects.SEARCH_Polybees,
      AllSkillEffects.SEARCH_CRY,
      AllSkillEffects.SEARCH_HAB,
      AllSkillEffects.DOUBLE_DARK_MATTER,
      AllSkillEffects.Honey_MULTI,
      AllSkillEffects.wax_MULTI,
      AllSkillEffects.COMPUTING_MULTI,
      AllSkillEffects.SHIPYARD_MULTI,
      AllSkillEffects.DOUBLE_MODDING,
      AllSkillEffects.RESEARCH_MULTI,
      AllSkillEffects.MODULE_LEVEL,
      AllSkillEffects.DOUBLE_BATTLE_GAIN,
      AllSkillEffects.DOUBLE_MISSILE,
      AllSkillEffects.MOD_Polybees_MINER,
      AllSkillEffects.MOD_Nectar_MINER,
      AllSkillEffects.MOD_Honey,
      AllSkillEffects.MOD_CPU,
      AllSkillEffects.MOD_wax,
      AllSkillEffects.MOD_WORKER,
      AllSkillEffects.MOD_SEARCH,
      AllSkillEffects.SEARCH_HAB2,
      AllSkillEffects.SEARCH_RANDOM,
      AllSkillEffects.DOUBLE_DISTRICTS,
      AllSkillEffects.MULTI_FACTORY,
      AllSkillEffects.TILE_MERGE,
      AllSkillEffects.SEARCH_BeesBot
    ];
    if (!prestige) {
      AllSkillEffects.effectList.forEach(e => {
        e.quantity = new Decimal(0);
        e.numOwned = 0;
        e.label = e.getDescription(1);
      });
    }

    AllSkillEffects.effectList.forEach(s => {
      s.buyAction.name = s.getDescription(1);
    });
  }
}
