import Axios, { AxiosResponse } from 'axios';
import BeautifulDom from 'beautiful-dom';
import { getRandomInt } from './random';
import { PROJECT_EULER_MAX } from './constants';

interface PuzzleResponse {
  status: number;
  id: number | string;
  problem: string;
}

/**
 * Return true iff a given ID will yield a valid Project Euler problem, probably.
 *
 * @param {string} id
 * @returns {Promise<boolean>}
 */
const validId = async (id: string): Promise<boolean> => {
  try {
    const num: number = Number(id);
    return 1 <= num && num <= PROJECT_EULER_MAX
  } catch (error) {
    return false;
  }
}

/**
 * Return a random problem from ProjectEuler
 *
 * @param {string} id the problem id, a number 1 through ...
 * @returns {Promise<PuzzleResponse>} an object containing the problem data
 */
export const getQuestion = async (id: string = 'random'): Promise<PuzzleResponse> => {
  if (!validId(id)) {
    throw new Error('Invalid Project Euler problem ID')
  }

  // The Project Euler URL
  const baseUrl: string = 'https://projecteuler.net'

  const processedId: number | string = id === 'random' ? getRandomInt(0, PROJECT_EULER_MAX) : id

  // Get the HTML text from a random page
  const response: AxiosResponse = await Axios.get(`${baseUrl}/problem=${processedId}`)
  if (response.status !== 200) {
    return {
      status: response.status,
      id: processedId,
      problem: '',
    }
  }

  const dom = new BeautifulDom(response.data);
  const node = dom.querySelector('div.problem_content');
  const text = node?.textContent || '';

  return {
    status: 200,
    id: processedId,
    problem: text,
  };
}
