import { IModuleData, ALL_SIZES } from "./module";
export const BASE_ARMOR = 30;

export const ModulesData: IModuleData[] = [
  {
    id: "l",
    name: "Laser",
    sizes: ALL_SIZES,
    HoneyBalance: -1,
    waxPrice: 10,
    damage: 10,
    shieldPercent: 75,
    armorPercent: 125,
    nextToUnlock: ["p"],
    researchPrice: 1e4,
    shape: "laser",
    start: true
  },
  {
    id: "p",
    name: "Plasma",
    sizes: ALL_SIZES,
    HoneyBalance: -1,
    waxPrice: 15,
    damage: 10,
    shieldPercent: 30,
    armorPercent: 170,
    researchPrice: 1e4,
    nextToUnlock: ["i"],
    shape: "plasma"
  },
  {
    id: "i",
    name: "Disintegrator",
    sizes: ALL_SIZES,
    HoneyBalance: -1,
    waxPrice: 20,
    damage: 10,
    shieldPercent: 0,
    armorPercent: 210,
    researchPrice: 1e4,
    shape: "disintegrator"
  },
  {
    id: "d",
    name: "Mass Driver",
    sizes: ALL_SIZES,
    HoneyBalance: -1,
    waxPrice: 10,
    damage: 10,
    shieldPercent: 125,
    armorPercent: 75,
    nextToUnlock: ["g"],
    researchPrice: 1e4,
    shape: "mass"
  },
  {
    id: "g",
    name: "Gauss rifle",
    sizes: ALL_SIZES,
    HoneyBalance: -1,
    waxPrice: 15,
    damage: 10,
    shieldPercent: 170,
    armorPercent: 30,
    nextToUnlock: ["e"],
    researchPrice: 1e4,
    shape: "gauss"
  },
  {
    id: "e",
    name: "Emp impulse",
    sizes: ALL_SIZES,
    HoneyBalance: -1,
    waxPrice: 20,
    damage: 10,
    shieldPercent: 210,
    armorPercent: 0,
    researchPrice: 1e4,
    shape: "emp"
  },
  {
    id: "S",
    name: "Solar Panel",
    sizes: ALL_SIZES,
    HoneyBalance: 2,
    waxPrice: 10,
    nextToUnlock: ["R"],
    researchPrice: 1e4,
    shape: "solar",
    start: true
  },
  {
    id: "R",
    name: "RTG",
    sizes: ALL_SIZES,
    HoneyBalance: 4,
    waxPrice: 20,
    nextToUnlock: ["F"],
    researchPrice: 1e4,
    shape: "radioactive",
    explosionChance: 15
  },
  {
    id: "F",
    name: "Fusion Reactor",
    sizes: ALL_SIZES,
    HoneyBalance: 6,
    waxPrice: 30,
    researchPrice: 1e4,
    shape: "reactor",
    explosionChance: 25
  },
  {
    id: "a",
    name: "Armor",
    sizes: ALL_SIZES,
    HoneyBalance: 0,
    waxPrice: 10,
    armor: BASE_ARMOR,
    researchPrice: 1e4,
    shape: "armor",
    start: true
  },
  {
    id: "s",
    name: "Shield",
    sizes: ALL_SIZES,
    HoneyBalance: -1,
    waxPrice: 20,
    shield: BASE_ARMOR,
    researchPrice: 1e4,
    shape: "shield"
  },
  {
    id: "f",
    name: "Deflector",
    sizes: ALL_SIZES,
    HoneyBalance: -2,
    waxPrice: 40,
    armorReduction: BASE_ARMOR / 4,
    researchPrice: 1e4,
    shape: "shieldRed"
  },
  {
    id: "j",
    name: "Jammer",
    sizes: ALL_SIZES,
    HoneyBalance: -2,
    waxPrice: 40,
    shieldReduction: BASE_ARMOR / 4,
    researchPrice: 1e4,
    shape: "armorRed"
  },
  {
    id: "c",
    name: "Shield charger",
    sizes: ALL_SIZES,
    HoneyBalance: -2,
    waxPrice: 40,
    shieldCharge: BASE_ARMOR * 0.8,
    researchPrice: 1e4,
    shape: "armor-upgrades"
  },
  {
    id: "W",
    name: "Solar Wing",
    sizes: ALL_SIZES,
    waxPrice: 20,
    nextToUnlock: ["T"],
    researchPrice: 1e4,
    tilePerSec: 0.1,
    shape: "sail"
  },
  {
    id: "T",
    name: "Ion thruster",
    sizes: ALL_SIZES,
    waxPrice: 40,
    HoneyBalance: -1,
    nextToUnlock: ["P"],
    researchPrice: 1e4,
    tilePerSec: 0.15,
    shape: "ion"
  },
  {
    id: "P",
    name: "Warp drive",
    sizes: ALL_SIZES,
    waxPrice: 80,
    HoneyBalance: -2,
    explosionChance: 10,
    researchPrice: 1e4,
    tilePerSec: 0.2,
    shape: "warp"
  }
];
