import Axios, { AxiosResponse, AxiosError } from 'axios';
import BeautifulDom from 'beautiful-dom';

export async function reddit() {
  console.log("Reddit called!")
  // Get the top post from the subreddit
  const result: any = await Axios.get(`http://www.reddit.com/r/dailyprogrammer/hot.json?limit=1`)
  const text = result.data.data.children.pop().data.selftext
  return {
    "problem": text
  }
}

export async function projectEuler() {
  console.log("ProjectEuler called!")
  // Get the HTML text from a random page
  const result: any = await Axios.get(`https://projecteuler.net/problem=100`)
  const dom = new BeautifulDom(result.data);
  const node = dom.querySelector('div.problem_content');
  const text = node.textContent;
  return {
    "problem": text
  }
}

export async function codingBat() {
  console.log("CodingBat called!")
  // Get the HTML text from a random page
  const result: any = await Axios.get(`https://codingbat.com/prob/p187868`)
  const dom = new BeautifulDom(result.data);
  //const node = dom.querySelector('p.max2');
  //const text = node.textContent;
  const complexQuery = dom.querySelectorAll('p table tr td div');
  const text = complexQuery[0].textContent
  return {
    "problem": text
  }
}