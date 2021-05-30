import TurndownService from 'turndown'

const turndownService = new TurndownService()

export const render = (html: string): string => {
  // TODO: add additional rendering logic here, as needed
  return turndownService.turndown(html)
}
