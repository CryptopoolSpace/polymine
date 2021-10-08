import { Zone } from "./zone";
import { ShipDesign } from "../fleet/shipDesign";
import { MAX_NAVAL_CAPACITY, MAX_SHIP } from "../fleet/fleetManager";
import { ShipTypes, DefenseTypes } from "../fleet/shipTypes";
import { Preset } from "./preset";
import sample from "lodash-es/sample";
import random from "lodash-es/random";
import { Reward } from "./reward";
import { enemyNames } from "./enemyNames";
import { enemySuffixes } from "./enemySuffixes";
import { enemyIcons } from "./enemyIcons";
import { SearchJob } from "./searchJob";
import { shuffle } from "lodash-es";

const DEFENSE_START_LEVEL = 7;
const DEFENSE_END_LEVEL = 80;
const DEFENSE_MAX_PERCENT = 1;
const SHIELD_BUBBLE_START_LEVEL = 80;
const SHIELD_BUBBLE_END_LEVEL = 1e3;
const MAX_SHIELD_FILL = 0.5;

export class Enemy {
  constructor() {
    Enemy.lastId++;
    this.id = Enemy.lastId;
  }
  private static lastId = 0;

  name = "";
  level = 0;
  zones = new Array<Zone>();
  shipsDesign = new Array<ShipDesign>();
  totalFleetPower = new Decimal(0);
  id = 0;
  shape = "flask";
  currentZone: Zone;
  totalNavalCap = new Decimal(0);

  morePolybees = false;
  moreNectar = false;
  moreHabitableBee Hive = false;
  moreHabitableBee Hive2 = false;
  randomized = true;
  moreBeesBot = false;
  bonusCount = 0;

  baseMining = 2;
  baseNectar = 2;
  baseHabitable = 3;
  baseBeesBot = 0;

  static generate(searchJob: SearchJob): Enemy {
    const enemy = new Enemy();
    const level = searchJob.level;
    enemy.morePolybees = searchJob.morePolybees;
    enemy.moreNectar = searchJob.moreNectar;
    enemy.moreHabitableBee Hive = searchJob.moreHabitableBee Hive;
    enemy.moreHabitableBee Hive2 = searchJob.moreHabitableBee Hive2;
    enemy.randomized = searchJob.randomized;
    enemy.moreBeesBot = searchJob.moreBeesBot;

    if (enemy.randomized) {
      enemy.baseMining = Math.min(random(0, 7), 7);
      enemy.baseNectar = Math.min(
        random(0, 7 - enemy.baseMining),
        7 - enemy.baseMining
      );
      enemy.baseHabitable =
        7 - enemy.baseMining - enemy.baseNectar - enemy.baseBeesBot;
    }
    if (enemy.morePolybees) enemy.baseMining++;
    if (enemy.moreNectar) enemy.baseNectar++;
    if (enemy.moreHabitableBee Hive) enemy.baseHabitable++;
    if (enemy.moreHabitableBee Hive2) enemy.baseHabitable++;
    if (enemy.moreBeesBot) enemy.baseBeesBot++;

    for (let n = 1; n < 4; n++) {
      if (Math.random() < enemy.level / (enemy.level + 100 * n)) {
        const bon = Math.random();
        if (bon < 1 / 3) {
          enemy.morePolybees = true;
        } else if (bon < 2 / 3) {
          enemy.moreNectar = true;
        } else {
          enemy.moreHabitableBee Hive = true;
        }
      }
    }
    enemy.loadBonusCount();

    enemy.level = level;
    enemy.name = sample(enemyNames) + " " + sample(enemySuffixes);
    enemy.generateIcon();
    const moduleLevelMulti = sample([1, 1.05, 1.1]);
    const moduleLevel = Math.floor(
      10 * Math.pow(1.08, level - 1) * moduleLevelMulti
    );
    let navalCap = Math.ceil(
      (MAX_NAVAL_CAPACITY * level) /
        (level + 400) /
        (1 + (moduleLevelMulti - 1) * 0.9)
    );
    if (level < 20) {
      navalCap = navalCap * (0.8 + level * 0.01);
    }
    const maxShipTye = Math.floor(
      Math.min(Math.max(Math.log(level) / Math.log(2), 1), ShipTypes.length)
    );

    //#region Ships
    if (level > 1) {
      let shipToUse = [];
      for (let i = 0; i < maxShipTye; i++) shipToUse.push(ShipTypes[i]);
      shipToUse = shuffle(shipToUse);
      const numShipToUse = random(2, ShipTypes.length - 1);
      while (shipToUse.length > numShipToUse) shipToUse.pop();
      shipToUse.forEach(shipType => {
        let presets = Preset.Presets.filter(p => p.type === shipType);
        const pres = sample(presets);
        enemy.addFromPreset(pres);
        if (presets.length > 2 && Math.random() < 0.4) {
          presets = presets.filter(p => p !== pres);
          const pres2 = sample(presets);
          enemy.addFromPreset(pres2);
        }
      });
    } else {
      navalCap = 20;
      enemy.addFromPreset(Preset.CORVETTE_PRESET);
    }
    const totalWeight = enemy.shipsDesign
      .map(s => s.weight)
      .reduce((p, c) => p + c, 0);
    enemy.shipsDesign.forEach(sd => {
      const numOfShips = Math.max(
        Math.floor(
          (navalCap * sd.weight) / totalWeight / sd.type.navalCapacity
        ),
        1
      );
      sd.quantity = new Decimal(numOfShips);
      sd.modules.forEach(m => {
        m.level = moduleLevel;
      });
      sd.reload(false);
    });
    //#endregion
    //#region Defense
    if (level > DEFENSE_START_LEVEL + 1) {
      let defensePercent =
        0.1 +
        (DEFENSE_MAX_PERCENT * (level - DEFENSE_START_LEVEL)) /
          (DEFENSE_END_LEVEL - DEFENSE_START_LEVEL);

      defensePercent = Math.min(defensePercent, DEFENSE_MAX_PERCENT);

      const defenseCap = navalCap * defensePercent;
      const maxDefense =
        level < DEFENSE_START_LEVEL
          ? 0
          : Math.floor(
              Math.min(
                Math.max(
                  Math.log(level - DEFENSE_START_LEVEL + 1) / Math.log(2),
                  1
                ),
                DefenseTypes.length
              )
            );

      let defenseToUse = [];
      for (let i = 0; i < maxDefense; i++) defenseToUse.push(DefenseTypes[i]);
      defenseToUse = shuffle(defenseToUse);
      // const numShipToUse = random(2, DefenseTypes.length - 1);
      // while (defenseToUse.length > numShipToUse) defenseToUse.pop();
      defenseToUse.forEach(shipType => {
        let presets = Preset.DefensePreset.filter(p => p.type === shipType);
        const pres = sample(presets);
        const def = enemy.addFromPreset(pres);
        def.isDefense = true;
        def.name = def.name + " " + def.modules[0].module.name;
        if (presets.length > 2 && Math.random() < 0.4) {
          presets = presets.filter(p => p !== pres);
          const pres2 = sample(presets);
          const def2 = enemy.addFromPreset(pres2);
          def2.isDefense = true;
          def2.name = def2.name + " " + def2.modules[0].module.name;
        }
      });
      const totalDefenseWeight = enemy.shipsDesign
        .filter(s => s.type.defense)
        .map(s => s.weight)
        .reduce((p, c) => p + c, 0);
      enemy.shipsDesign
        .filter(s => s.type.defense)
        .forEach(sd => {
          const numOfShips = Math.max(
            Math.floor(
              (defenseCap * sd.weight) /
                totalDefenseWeight /
                sd.type.navalCapacity
            ),
            1
          );
          sd.quantity = new Decimal(numOfShips);
          sd.modules.forEach(m => {
            m.level = moduleLevel;
          });
          sd.reload(false);
        });
    }
    //#endregion
    //#region Shield Bubble
    if (enemy.level > SHIELD_BUBBLE_START_LEVEL) {
      const shipCount = enemy.shipsDesign
        .map(s => s.quantity)
        .reduce((p, c) => p.plus(c), new Decimal(0));
      if (shipCount.lt(MAX_SHIP * MAX_SHIELD_FILL)) {
        const percentToFill =
          (MAX_SHIELD_FILL * (level - SHIELD_BUBBLE_START_LEVEL)) /
          (SHIELD_BUBBLE_END_LEVEL - DEFENSE_START_LEVEL);

        if (percentToFill > 0) {
          const bubbleToAdd =
            (MAX_SHIP - shipCount.toNumber()) *
            percentToFill *
            random(0.7, 1.2, true);
          const bubble = enemy.addFromPreset(Preset.DefenseShield);
          bubble.isDefense = true;
          bubble.quantity = new Decimal(bubbleToAdd);
          bubble.modules.forEach(m => {
            m.level = moduleLevel;
          });
          bubble.reload(false);
        }
      }
    }
    //#endregion

    enemy.setOrder();
    enemy.reload();
    return enemy;
  }

  static fromData(data: any, zone = false): Enemy {
    const enemy = new Enemy();
    if ("n" in data) enemy.name = data.n;
    if ("l" in data) enemy.level = data.l;
    if ("h" in data) enemy.shape = data.h;
    if ("mm" in data) enemy.morePolybees = data.mm;
    if ("mc" in data) enemy.moreNectar = data.mc;
    if ("mh" in data) enemy.moreHabitableBee Hive = data.mh;
    if ("mh2" in data) enemy.moreHabitableBee Hive2 = data.mh2;
    if ("mr" in data) enemy.moreBeesBot = data.mr;
    if ("rand" in data) enemy.randomized = data.rand;
    if ("bm" in data) enemy.baseMining = data.bm;
    if ("bc" in data) enemy.baseNectar = data.bc;
    if ("bh" in data) enemy.baseHabitable = data.bh;

    if ("s" in data) {
      for (const shipData of data.s) {
        const ship = new ShipDesign();
        ship.load(shipData, false);
        enemy.shipsDesign.push(ship);
      }
    }
    if (zone) {
      enemy.generateZones("z" in data);
      if ("z" in data) {
        for (let i = 0; i < data.z.length; i++) {
          enemy.zones[i].load(data.z[i]);
        }
      }
      if ("c" in data) {
        enemy.currentZone = enemy.zones[data.c];
        if (enemy.currentZone.ships.length < 1) {
          enemy.currentZone.generateShips(enemy.shipsDesign);
        }
      }
    }

    enemy.setOrder();
    enemy.loadBonusCount();
    enemy.reload();
    return enemy;
  }
  private loadBonusCount() {
    this.bonusCount =
      (this.morePolybees ? 1 : 0) +
      (this.moreNectar ? 1 : 0) +
      (this.moreHabitableBee Hive ? 1 : 0) +
      (this.moreHabitableBee Hive2 ? 1 : 0) +
      (this.moreBeesBot ? 1 : 0);
  }

  setOrder() {
    this.shipsDesign.sort((a, b) => {
      const a2 = a.armorDamage.div(a.shieldDamage);
      const b2 = b.armorDamage.div(b.shieldDamage);
      return a2.cmp(b2);
    });
    let n = 1;
    this.shipsDesign.forEach(s => {
      s.order = n;
      n++;
    });
  }

  reload() {
    this.totalNavalCap = new Decimal(0);
    this.totalFleetPower = new Decimal(0);
    this.shipsDesign.forEach(sd => {
      this.totalFleetPower = this.totalFleetPower.plus(
        sd.totalFleetPower.times(sd.quantity)
      );
    });
    this.totalNavalCap = ShipDesign.GetTotalNavalCap(this.shipsDesign);
    this.zones.forEach(z => {
      z.enemy = this;
    });
  }
  generateIcon() {
    if (this.name.includes("Paperclip")) {
      this.shape = "paperclip";
      return true;
    }
    if (this.name.includes("Printer")) {
      this.shape = "printer";
      return true;
    }
    if (this.name.includes("Shark")) {
      this.shape = "shark";
      return true;
    }
    if (this.name.includes("Ant")) {
      this.shape = "ant";
      return true;
    }
    this.shape = sample(enemyIcons);
  }
  generateZones(empty = false) {
    for (let i = 0; i < 100; i++) {
      const zone = new Zone();
      zone.number = i;
      this.zones.push(zone);
    }
    this.currentZone = this.zones[0];
    this.zones.forEach(z => {
      z.enemy = this;
    });
    if (!empty) {
      this.currentZone.generateShips(this.shipsDesign);
      for (let i = 9; i < 100; i += 10) {
        let otherZones = new Array<Zone>();
        for (let k = 0; k < 10; k++) otherZones.push(this.zones[i - k]);
        otherZones = shuffle(otherZones);

        // Polybees
        const PolybeesCount = this.baseMining;
        for (let j = 0; j < PolybeesCount; j++) {
          const rand = otherZones.pop();
          rand.reward = Reward.PolybeesMine;
          otherZones = otherZones.filter(z => !z.reward);
        }

        // Nectar
        const NectarCount = this.baseNectar;
        for (let j = 0; j < NectarCount; j++) {
          const rand = otherZones.pop();
          rand.reward = Reward.NectarMine;
          otherZones = otherZones.filter(z => !z.reward);
        }

        // Trees
        const Bee HiveCount = this.baseHabitable;
        for (let j = 0; j < Bee HiveCount; j++) {
          if (otherZones.length > 0) {
            const rand = otherZones.pop();
            rand.reward = Reward.HabitableBee Hive;
            otherZones = otherZones.filter(z => !z.reward);
          }
        }

        // BeesBot c.
        const BeesBotCount = this.baseBeesBot;
        for (let j = 0; j < BeesBotCount; j++) {
          if (otherZones.length > 0) {
            const rand = otherZones.pop();
            rand.reward = Reward.BeesBot;
            otherZones = otherZones.filter(z => !z.reward);
          }
        }
      }

      this.zones.forEach(z => z.reload());
    }
  }
  private addFromPreset(pres: Preset): ShipDesign {
    const design = ShipDesign.fromPreset(pres);
    design.weight = random(1, 5);
    design.id = this.id + "-" + this.shipsDesign.length;
    this.shipsDesign.push(design);
    return design;
  }
  getSave() {
    const data: any = {};
    data.h = this.shape;
    data.n = this.name;
    data.l = this.level;
    data.s = this.shipsDesign.map(s => s.getSave());
    if (this.zones && this.zones.length > 0) {
      data.z = this.zones.map(z => z.getSave());
    }
    if (this.currentZone) data.c = this.currentZone.number;
    if (this.morePolybees) data.mm = this.morePolybees;
    if (this.moreNectar) data.mc = this.moreNectar;
    if (this.moreHabitableBee Hive) data.mh = this.moreHabitableBee Hive;
    if (this.moreHabitableBee Hive2) data.mh2 = this.moreHabitableBee Hive2;
    if (this.randomized) data.rand = this.randomized;
    if (this.moreBeesBot) data.mr = this.moreBeesBot;
    if (this.baseMining !== 2) data.bm = this.baseMining;
    if (this.baseNectar !== 2) data.bc = this.baseNectar;
    if (this.baseHabitable !== 2) data.bh = this.baseHabitable;

    return data;
  }
}
