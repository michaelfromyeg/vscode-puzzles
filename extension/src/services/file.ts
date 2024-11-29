import * as fs from "fs";
import { render } from "mustache";
import * as path from "path";
import * as vscode from "vscode";
import { Config } from "../config";
import { templates } from "../templates";
import { Problem, ProblemTemplate } from "../types";
import { Logger } from "../utils/logger";

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

  async createProblemFiles(problem: Problem): Promise<void> {
    const workspaceFolder = this.getWorkspaceFolder();
    if (!workspaceFolder) {
      throw new Error("No workspace folder open");
    }

    const dirName = this.createDirectory(workspaceFolder);
    await this.writeFiles(problem, dirName, workspaceFolder);
  }

  private getWorkspaceFolder(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  private createDirectory(workspaceFolder: string): string {
    const today = new Date();
    const dirName = today.toISOString().split("T")[0];
    if (!dirName) {
      throw new Error("Failed to get directory name");
    }

    const dirPath = path.join(workspaceFolder, dirName);
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      return dirName;
    } catch (error) {
      this.logger.error("Failed to create directory", error);
      throw error;
    }
  }

  private async writeFiles(
    problem: Problem,
    dirName: string,
    workspaceFolder: string,
  ): Promise<void> {
    const template: ProblemTemplate = {
      title: "Today's Puzzle",
      date: new Date().toLocaleDateString(),
      source: problem.source,
      id: problem.id,
      problem: problem.problem,
    };

    const markdown = render(templates.markdown, template);
    const code = templates[Config.getDefaultLanguage()];

    const files = [
      { name: `${problem.source}.md`, content: markdown },
      { name: `${problem.source}.${this.getFileExtension()}`, content: code },
    ];

    for (const file of files) {
      const filePath = path.join(workspaceFolder, dirName, file.name);
      await fs.promises.writeFile(filePath, file.content);
    }
  }

  private getFileExtension(): string {
    const language = Config.getDefaultLanguage();
    const extensions: Record<string, string> = {
      python: "py",
      javascript: "js",
      typescript: "ts",
    };
    return extensions[language] || "txt";
  }
}
