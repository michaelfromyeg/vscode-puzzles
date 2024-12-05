import Axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import he from "he";

interface AocPuzzleResponse {
  status: number;
  id: string;
  problem: string;
}

interface AocPuzzleParams {
  year: number;
  day: number;
}

const AOC_BASE_URL = "https://adventofcode.com";

/**
 * Validate the year and day parameters for Advent of Code.
 * Puzzles become available at midnight Eastern Time.
 *
 * @param params The year and day parameters
 * @returns boolean indicating if the parameters are valid
 */
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
      // Create current time in EST
      const currentDate = new Date();
      const estOptions = { timeZone: "America/New_York" };
      const estTime = new Date(currentDate.toLocaleString("en-US", estOptions));

      // Create puzzle release time (midnight EST on puzzle day)
      const puzzleDate = new Date(year, 11, day); // Month is 0-based
      puzzleDate.setHours(0, 0, 0, 0);

      // Convert puzzle date to EST for comparison
      const puzzleEST = new Date(
        puzzleDate.toLocaleString("en-US", estOptions)
      );

      if (estTime < puzzleEST) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Parse the params string into year and day
 *
 * @param params string in format "year/day"
 * @returns parsed year and day
 */
const parseParams = (params: string): AocPuzzleParams => {
  const [year, day] = params.split("/").map(Number);
  return { year, day };
};

/**
 * Get a puzzle from Advent of Code
 *
 * @param params string in format "year/day" (e.g., "2023/1")
 * @returns Promise with the puzzle response
 */
export const getQuestion = async (
  params: string = `${new Date().getFullYear()}/1`
): Promise<AocPuzzleResponse> => {
  if (!validateParams(params)) {
    return {
      status: 400,
      id: params,
      problem: "",
    };
  }

  const { year, day } = parseParams(params);

  // Get the HTML text from the AoC page
  const response: AxiosResponse = await Axios.get(
    `${AOC_BASE_URL}/${year}/day/${day}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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

  // AoC problem descriptions are in main article elements
  const mainArticle = $("article.day-desc").first();

  // Remove any input elements or examples that are typically in <pre> tags
  mainArticle.find("pre").remove();

  // Process the HTML more carefully
  let problemText = "";

  // Process each element while maintaining structure
  mainArticle.contents().each((_, elem) => {
    if (elem.type === "text") {
      // Add text with proper spacing
      problemText += elem.data.trim() + "\n";
    } else if (elem.type === "tag") {
      const $elem = $(elem);
      if (elem.tagName === "h2") {
        // Handle headings
        problemText += `\n${$elem.text()}\n${"=".repeat(
          $elem.text().length
        )}\n\n`;
      } else if (elem.tagName === "p") {
        // Handle paragraphs
        problemText += `${$elem.text()}\n\n`;
      } else if (elem.tagName === "em") {
        // Handle emphasis
        problemText += `*${$elem.text()}*`;
      } else if (elem.tagName === "code") {
        // Handle code
        problemText += `\`${$elem.text()}\``;
      } else if (elem.tagName === "pre") {
        // Skip pre tags as they usually contain example inputs
        return;
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
