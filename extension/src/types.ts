export interface Problem {
  id: string | number;
  problem: string;
  source: ProblemSource;
}

export type ProblemSource =
  | "reddit"
  | "projectEuler"
  | "codingBat"
  | "adventOfCode";

export interface ProblemTemplate {
  title: string;
  date: string;
  source: string;
  id: string | number;
  problem: string;
}

export type SupportedLanguage =
  | "python"
  | "javascript"
  | "typescript"
  | "java"
  | "cpp";
export type TemplateFormat = "markdown" | "text";
