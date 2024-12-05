import * as fs from "fs";
import Mustache from "mustache";
import * as path from "path";
import * as vscode from "vscode";
import { Config } from "../config";
import { templates } from "../templates";
import { Problem, ProblemTemplate } from "../types";
import { Logger } from "../utils/logger";

interface CreateProblemOptions {
  date?: Date;
  input?: string;
}

export class FileService {
  private static instance: FileService;
  private logger = Logger.getInstance();

  private constructor() {}

  static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  async createProblemFiles(
    problem: Problem,
    options: CreateProblemOptions = {},
  ): Promise<void> {
    const workspaceFolder = this.getWorkspaceFolder();
    if (!workspaceFolder) {
      throw new Error("No workspace folder open");
    }

    const dirName = this.createDirectory(workspaceFolder, options.date);
    await this.writeFiles(problem, dirName, workspaceFolder, options);
  }

  private getWorkspaceFolder(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  private createDirectory(workspaceFolder: string, date?: Date): string {
    const targetDate = date || new Date();
    const dirName = this.formatDate(targetDate);
    if (!dirName) {
      throw new Error("Failed to get directory name");
    }

    const dirPath = path.join(workspaceFolder, dirName);
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      return dirName;
    } catch (error) {
      this.logger.error("Failed to create directory", error);
      throw error;
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private async writeFiles(
    problem: Problem,
    dirName: string,
    workspaceFolder: string,
    options: CreateProblemOptions = {},
  ): Promise<void> {
    const template: ProblemTemplate = {
      title: "Today's Puzzle",
      date: new Date().toLocaleDateString(),
      source: problem.source,
      id: problem.id,
      problem: problem.problem,
    };

    const markdown = Mustache.render(templates.markdown, template);
    const code = templates[Config.getDefaultLanguage()];

    const files = [
      { name: this.getFileName(problem, "md"), content: markdown },
      {
        name: this.getFileName(problem, this.getFileExtension()),
        content: code,
      },
    ];

    if (options.input) {
      files.push({ name: "input.txt", content: options.input });
    }

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(workspaceFolder, dirName, file.name);
        await fs.promises.writeFile(filePath, file.content);
      }),
    );
  }

  private getFileExtension(): string {
    const language = Config.getDefaultLanguage();
    const extensions: Record<string, string> = {
      python: "py",
      javascript: "js",
      typescript: "ts",
      java: "java",
      cpp: "cpp",
    };
    return extensions[language] || "txt";
  }

  private getFileName(problem: Problem, extension: string): string {
    if (problem.source === "adventOfCode") {
      console.log(problem.id);
      const [_, dayNumber] = problem.id.toString().split("/");
      if (!dayNumber) {
        throw new Error("Invalid Advent of Code problem ID");
      }

      // Handle if dayNumber already includes "day" prefix
      const cleanDay = dayNumber.replace(/^day/, "");
      return `day${cleanDay.padStart(2, "0")}.${extension}`;
    }

    // For other sources, create a slug from the source name
    const sourceSlug = problem.source
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/^-/, "");

    if (problem.id) {
      return `${sourceSlug}-${problem.id}.${extension}`;
    }

    return `${sourceSlug}.${extension}`;
  }
}
