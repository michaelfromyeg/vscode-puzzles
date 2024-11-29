import Axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PROJECT_EULER_BASE_URL, PROJECT_EULER_MAX } from "./constants.js";
import { getRandomInt } from "./random.js";

interface PuzzleResponse {
  status: number;
  id: number | string;
  problem: string;
}

/**
 * Return true iff a given ID will yield a valid Project Euler problem, probably.
 *
 * @param {string} id
 * @returns {boolean}
 */
const validId = (id: string): boolean => {
  try {
    if (id === "random") {
      return true;
    }

    const value: number = Number(id);
    return 1 <= value && value <= PROJECT_EULER_MAX;
  } catch (error) {
    return false;
  }
};

const getLocalQuestion = async (id: number | string): Promise<string> => {
  try {
    const filePath = join(process.cwd(), "src", "euler", `${id}.html`);
    const content = await readFile(filePath, "utf-8");
    const $ = cheerio.load(content);
    // Since local files are raw HTML, we just need the text content
    return content || "";
  } catch (error) {
    return "";
  }
};

/**
 * Return a random problem from ProjectEuler
 *
 * @param {string} id the problem id, a number 1 through ...
 * @returns {Promise<PuzzleResponse>} an object containing the problem data
 */
export const getQuestion = async (
  id: string = "random"
): Promise<PuzzleResponse> => {
  if (!validId(id)) {
    return {
      status: 400,
      id,
      problem: "",
    };
  }

  const processedId: number | string =
    id === "random" ? getRandomInt(0, PROJECT_EULER_MAX) : id;

  const localProblem = await getLocalQuestion(processedId);
  if (localProblem) {
    return {
      status: 200,
      id: processedId,
      problem: localProblem,
    };
  }

  // Get the HTML text from a random page
  const response: AxiosResponse = await Axios.get(
    `${PROJECT_EULER_BASE_URL}/problem=${processedId}`
  );
  if (!response || response?.status !== 200) {
    return {
      status: response.status ?? 500,
      id: processedId,
      problem: "",
    };
  }

  const $ = cheerio.load(response.data);
  const text = $("div.problem_content").text() || "";
  return {
    status: 200,
    id: processedId,
    problem: text,
  };
};
