import Axios, { AxiosResponse } from 'axios';

interface PuzzleResponse {
  status: number;
  id: number | string;
  problem: string;
}

const validId = async (id: string): Promise<boolean> => {
  // TODO: determine whether or not a given ID is potentially a Reddit post ID
  return true;
}

/**
 * Fetch the latest problem from r/dailyprogrammer, using the Reddit API
 *
 * @returns {Promise<PuzzleResponse>} the problem text
 * @throws {Error} if post ID is invalid
 */
export const getQuestion = async (id: string = 'latest'): Promise<PuzzleResponse> => {
  if (!validId(id)) {
    throw new Error('Invalid Reddit post ID')
  }

  // The r/dailyprogrammer URL
  const baseUrl: string = 'https://reddit.com/r/dailyprogrammer'

  // Get the top post from the subreddit or a specific post
  const response: AxiosResponse = await Axios.get(id === 'latest' ? `${baseUrl}/hot.json?limit=1` : `${baseUrl}/comments/${id}.json`)
  if (response.status !== 200) {
    return {
      status: response.status,
      id,
      problem: '', // for any error, return no text
    };
  }

  // Get question text
  const text = response.data.data.children.pop().data.selftext

  return {
    status: 200,
    id,
    problem: text,
  };
}
