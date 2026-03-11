import { dailyNewsCases, type DailyNewsCase } from "./dailyNewsCases";

export function getDailyNewsCases(limit = 3): DailyNewsCase[] {
  return dailyNewsCases.slice(0, limit);
}

export function getRandomDailyNewsCase(): DailyNewsCase {
  const index = Math.floor(Math.random() * dailyNewsCases.length);
  return dailyNewsCases[index];
}

export function getDailyNewsCasesByRegion(region: DailyNewsCase["region"]) {
  return dailyNewsCases.filter((item) => item.region === region);
}

export function getDailyNewsCasesByTheme(theme: DailyNewsCase["theme"]) {
  return dailyNewsCases.filter((item) => item.theme === theme);
}