import { NodeHtmlMarkdown } from "node-html-markdown";

const nhm = new NodeHtmlMarkdown();

export const render = (html: string | undefined): string => {
  return nhm.translate(html || "");
};
