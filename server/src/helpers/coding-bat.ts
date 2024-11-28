import Axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { CODING_BAT_BASE_URL } from "./constants.js";

interface PuzzleResponse {
  status: number;
  id: number | string;
  problem: string;
}

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
    };
  }

  // TODO(michaelfromyeg): implement randomness
  const processedId: number | string = id === "random" ? "153599" : id;

  const response: AxiosResponse = await Axios.get(
    `${CODING_BAT_BASE_URL}/p${processedId}`
  );
  if (!response || response?.status !== 200) {
    return {
      status: response?.status ?? 500,
      id: processedId,
      problem: "",
    };
  }

  const $ = cheerio.load(response.data);
  const text = $("p table tr td div").first().text() || "";
  return {
    status: 200,
    id: processedId,
    problem: text,
  };
};
