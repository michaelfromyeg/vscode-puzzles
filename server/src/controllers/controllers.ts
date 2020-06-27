import Axios, { AxiosResponse, AxiosError } from 'axios';

export async function reddit() {
  console.log("Reddit called!")
  // Get the top post from the subreddit
  const result: any = await Axios.get(`http://www.reddit.com/r/dailyprogrammer/hot.json?limit=1`)
  const text = result.data.data.children.pop().data.selftext
  return {
    "problem": text
  }
}

export function leetcode() {
  console.log("Leetcode called!")
}

export function codingbat() {
  console.log("Codingbat called!")
}