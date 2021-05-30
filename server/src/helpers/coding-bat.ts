import Axios, { AxiosResponse } from 'axios';
import BeautifulDom from 'beautiful-dom';

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
 * Return a problem from CodingBat.
 *
 * @param {string} id the CodingBat problem number
 * @returns {Promise<PuzzleResponse>} an object containing the problem text
 */
export const getQuestion = async (id: string = 'random'): Promise<PuzzleResponse> => {
  if (!validId(id)) {
    throw new Error('Invalid Coding Bat problem ID')
  }

  // The CodingBat URL
  const baseUrl = 'https://codingbat.com/prob'

  const processedId: number | string = id === 'random' ? '153599' : id

  // Get the HTML text from a "random" page (TODO: implement randomness, somehow)
  const response: AxiosResponse = await Axios.get(`${baseUrl}/p${processedId}`)
  if (response.status !== 200) {
    return {
      status: response.status,
      id: processedId,
      problem: '',
    };
  }

  const dom = new BeautifulDom(response.data);
  const complexQuery = dom.querySelectorAll('p table tr td div');
  const text = complexQuery.length === 0 ? '' : complexQuery[0].textContent

  return {
    status: 200,
    id: processedId,
    problem: text,
  };
}

