// src/commands/getAdventOfCode.ts
import * as vscode from "vscode";

interface AdventOfCodeParams {
  year: number;
  day: number;
}

export async function getAdventOfCodeProblem(): Promise<
  AdventOfCodeParams | undefined
> {
  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;

  // If it's not December, use previous year as default
  const defaultYear = currentMonth === 12 ? currentYear : currentYear - 1;

  // Get year input
  const yearInput = await vscode.window.showInputBox({
    title: "Advent of Code Year",
    prompt: "Enter year (2015-present)",
    placeHolder: `${defaultYear}`,
    validateInput: (value: string) => {
      if (value === "") return null; // Allow empty for default
      const year = parseInt(value);
      if (isNaN(year)) return "Please enter a valid year";
      if (year < 2015) return "Advent of Code started in 2015";
      if (year > currentYear) return "Cannot select future years";
      return null;
    },
  });

  if (yearInput === undefined) return undefined; // User cancelled

  const year = yearInput === "" ? defaultYear : parseInt(yearInput);

  // Calculate default day
  let defaultDay = 1;
  if (year === currentYear && currentMonth === 12) {
    defaultDay = Math.min(currentDay, 25); // Cap at 25 since AoC ends on Christmas
  } else if (
    year < currentYear ||
    (year === currentYear && currentMonth > 12)
  ) {
    defaultDay = 25; // For past years, default to last day
  }

  // Get day input
  const dayInput = await vscode.window.showInputBox({
    title: "Advent of Code Day",
    prompt: "Enter day (1-25)",
    placeHolder: `${defaultDay}`,
    validateInput: (value: string) => {
      if (value === "") return null; // Allow empty for default
      const day = parseInt(value);
      if (isNaN(day)) return "Please enter a valid day";
      if (day < 1 || day > 25) return "Day must be between 1 and 25";
      if (year === currentYear && currentMonth === 12 && day > currentDay) {
        return "Cannot select future days";
      }
      return null;
    },
  });

  if (dayInput === undefined) return undefined; // User cancelled

  const day = dayInput === "" ? defaultDay : parseInt(dayInput);

  return { year, day };
}
