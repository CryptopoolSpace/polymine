import { getMiners } from "src/app/app.component.spec";

describe("AutomatorManager", () => {
  it("should have unique ids", () => {
    const Miners = getMiners();
    const ids = Miners.automatorManager.automatorGroups.map(m => m.id);
    const unique = Array.from(new Set(ids));
    expect(ids.length).toBe(unique.length);
    if (ids.length !== unique.length) {
      const nonUnique = ids.filter(a => ids.indexOf(a) !== ids.lastIndexOf(a));
      console.log(nonUnique);
    }
  });
});
