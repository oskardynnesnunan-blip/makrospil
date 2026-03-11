import { dailyNewsCases, type DailyNewsCase } from "./dailyNewsCases";

export function getDailyNewsCases(limit = 3): DailyNewsCase[] {
  return dailyNewsCases.slice(0, limit);
}

export function getRandomDailyNewsCase(): DailyNewsCase {
  const randomIndex = Math.floor(Math.random() * dailyNewsCases.length);
  return dailyNewsCases[randomIndex];
}