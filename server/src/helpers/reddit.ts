import Axios, { AxiosResponse } from "axios";
import { PuzzleResponse } from "../server.js";
import { REDDIT_DAILYPROGRAMMER_BASE_URL } from "./constants.js";

const validId = (id: string): boolean => {
  // TODO: determine whether or not a given ID is potentially a Reddit post ID
  return true;
};

/**
 * Fetch the latest problem from r/dailyprogrammer, using the Reddit API
 *
 * @returns {Promise<PuzzleResponse>} the problem text
 * @throws {Error} if post ID is invalid
 */
export const getQuestion = async (
  id: string = "latest"
): Promise<PuzzleResponse> => {
  if (!validId(id)) {
    return {
      status: 400,
      id,
      problem: "",
      error: `${id} is not a valid Reddit post ID`,
    };
  }

  // Get the top post from the subreddit or a specific post
  const response: AxiosResponse = await Axios.get(
    id === "latest"
      ? `${REDDIT_DAILYPROGRAMMER_BASE_URL}/hot.json?limit=1`
      : `${REDDIT_DAILYPROGRAMMER_BASE_URL}/comments/${id}.json`
  );
  if (!response || response?.status !== 200) {
    return {
      status: response?.status ?? 500,
      id,
      problem: "",
    };
  }

  const text = response.data.data.children.pop().data.selftext;
  return {
    status: 200,
    id,
    problem: text,
  };
};
