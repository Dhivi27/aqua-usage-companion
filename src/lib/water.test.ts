import { describe, expect, it } from "vitest";
import { classifyFlow, groupByMonth, linearForecast, toCsv, totalLiters } from "./water";

describe("water helpers", () => {
  it("flags flow at 150% of expected as Leakage", () => {
    expect(classifyFlow(15, 10)).toBe("Leakage");
  });
  it("flags flow at 120% of expected as Warning", () => {
    expect(classifyFlow(12, 10)).toBe("Warning");
  });
  it("treats flow under 120% as Normal", () => {
    expect(classifyFlow(11.9, 10)).toBe("Normal");
  });
  it("sums liters", () => {
    expect(totalLiters([{ usage_date: "2026-01-01", liters: 100 }, { usage_date: "2026-01-02", liters: 50 }])).toBe(150);
  });
  it("groups by month", () => {
    expect(
      groupByMonth([
        { usage_date: "2026-01-01", liters: 100 },
        { usage_date: "2026-01-20", liters: 50 },
        { usage_date: "2026-02-01", liters: 10 },
      ]),
    ).toEqual([{ month: "2026-01", liters: 150 }, { month: "2026-02", liters: 10 }]);
  });
  it("forecasts a linear trend", () => {
    expect(linearForecast([10, 20, 30], 2)).toEqual([40, 50]);
  });
  it("escapes CSV values", () => {
    expect(toCsv([{ a: "x,y", b: 1 }])).toBe('a,b\n"x,y",1');
  });
});
