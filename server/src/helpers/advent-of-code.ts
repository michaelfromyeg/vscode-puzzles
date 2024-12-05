import Axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import he from "he";
import { PuzzleResponse } from "../server.js";

const AOC_BASE_URL = "https://adventofcode.com";

const validateParams = (params: string): boolean => {
  try {
    const [year, day] = params.split("/").map(Number);
    const currentYear = new Date().getFullYear();

    // Check year (AoC started in 2015)
    if (year < 2015 || year > currentYear) {
      return false;
    }

    // Check day (1-25 for advent calendar)
    if (day < 1 || day > 25) {
      return false;
    }

    // If it's current year, check if the day is available based on EST
    if (year === currentYear) {
      // Get current time in EST
      const estOptions = { timeZone: "America/New_York" };
      const now = new Date();
      const estDate = new Date(now.toLocaleString("en-US", estOptions));

      // Get components of current EST time
      const estYear = estDate.getFullYear();
      const estMonth = estDate.getMonth() + 1; // 1-based month
      const estDay = estDate.getDate();
      const estHour = estDate.getHours();

      // Puzzles are released at midnight EST
      // For December, check if we've reached the puzzle day
      if (estMonth === 12) {
        if (estDay < day) {
          return false;
        }
        // If it's the same day, ensure we're past midnight EST
        if (estDay === day && estHour === 0) {
          return false;
        }
      } else {
        // Not December, no current year puzzles available
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get a puzzle from Advent of Code
 *
 * @param params string in format "year/day" (e.g., "2023/1")
 * @returns Promise with the puzzle response
 */
export const getQuestion = async (
  params: string = `${new Date().getFullYear()}/1`
): Promise<PuzzleResponse> => {
  if (!validateParams(params)) {
    return {
      status: 400,
      id: params,
      problem: "",
      error: `${params} is not a valid Advent of Code puzzle ID`,
    };
  }

  const [year, day] = params.split("/").map(Number);

  // Get the HTML text from the AoC page
  const response: AxiosResponse = await Axios.get(
    `${AOC_BASE_URL}/${year}/day/${day}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
        "Cache-Control": "no-cache",
      },
    }
  );
  if (!response || response?.status !== 200) {
    return {
      status: response.status ?? 500,
      id: params,
      problem: "",
    };
  }

  const $ = cheerio.load(response.data);
  const mainArticle = $("article.day-desc").first();

  // Process the HTML more carefully
  let problemText = "";
  mainArticle.contents().each((_, elem) => {
    if (elem.type === "text") {
      problemText += elem.data.trim() + "\n";
    } else if (elem.type === "tag") {
      const $elem = $(elem);
      if (elem.tagName === "h2") {
        problemText += `\n${$elem.text()}\n${"=".repeat(
          $elem.text().length
        )}\n\n`;
      } else if (elem.tagName === "p") {
        problemText += `${$elem.text()}\n\n`;
      } else if (elem.tagName === "em") {
        problemText += `*${$elem.text()}*`;
      } else if (elem.tagName === "code") {
        problemText += `\`${$elem.text()}\``;
      }
    }
  });

  // Clean up the text
  problemText = problemText
    .replace(/\n\s+\n/g, "\n\n") // Remove excess whitespace
    .replace(/\n{3,}/g, "\n\n") // Limit consecutive newlines
    .trim();

  // Add a note about where to find input
  const problemWithNote = `${problemText}\n\n---\nTo get your personal puzzle input, visit:\n${AOC_BASE_URL}/${year}/day/${day}/input`;

  return {
    status: 200,
    id: params,
    problem: he.decode(problemWithNote),
  };
};
