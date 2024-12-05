import Axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { PuzzleResponse } from "../server.js";
import { CODING_BAT_BASE_URL } from "./constants.js";

const validId = (id: string): boolean => {
  // TODO: determine whether or not a given ID is potentially a Reddit post ID
  return true;
};

/**
 * Return a problem from CodingBat.
 *
 * @param {string} id the CodingBat problem number
 * @returns {Promise<PuzzleResponse>} an object containing the problem text
 */
export const getQuestion = async (
  id: string = "random"
): Promise<PuzzleResponse> => {
  if (!validId(id)) {
    return {
      status: 400,
      id,
      problem: "",
      error: `${id} is not a valid CodingBat problem ID`,
    };
  }

  // TODO(michaelfromyeg): implement randomness
  const processedId: number | string = id === "random" ? "153599" : id;

  const response: AxiosResponse = await Axios.get(
    `${CODING_BAT_BASE_URL}/p${processedId}`
  );
  console.log("****", response);
  if (!response || response?.status !== 200) {
    return {
      status: response?.status ?? 500,
      id: processedId,
      problem: "",
    };
  }

  const $ = cheerio.load(response.data);

  // Get the main problem description
  const descriptionDiv = $("div.minh");
  const description = descriptionDiv.find("p.max2").text();

  // Get the examples by looking at the text nodes after div.minh
  const examples: string[] = [];
  descriptionDiv
    .parent()
    .contents()
    .each((_, elem) => {
      if (elem.type === "text") {
        const text = $(elem).text().trim();
        if (text && text.includes("→")) {
          examples.push(text);
        }
      }
    });

  if (!description) {
    return {
      status: 404,
      id: processedId,
      problem: "",
    };
  }

  const fullProblem = `${description}\n\nExamples:\n${examples.join("\n")}`;

  return {
    status: 200,
    id: processedId,
    problem: fullProblem,
  };
};
