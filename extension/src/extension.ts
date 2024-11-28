import * as vscode from "vscode";

import { getAdventOfCodeProblem } from "./commands/adventOfCode";
import { setDefaultLanguage } from "./commands/defaultLanguage";
import { ApiService } from "./services/api";
import { FileService } from "./services/file";
import { ProblemSource } from "./types";
import { Logger } from "./utils/logger";

export function activate(context: vscode.ExtensionContext): void {
  const logger = Logger.getInstance();
  const apiService = ApiService.getInstance();
  const fileService = FileService.getInstance();

  logger.info("Puzzles extension is now active!");

  const commandHandlers = {
    "extsn.setLanguage": setDefaultLanguage,
    "extsn.getReddit": () => handleProblemGeneration("reddit"),
    "extsn.getProjectEuler": async () => {
      const id = await vscode.window.showInputBox({
        prompt: "Enter a problem ID (1-784) or leave empty for random",
      });
      await handleProblemGeneration("projectEuler", id);
    },
    "extsn.getCodingBat": () => handleProblemGeneration("codingBat"),
    "extsn.getAdventOfCode": async () => {
      const params = await getAdventOfCodeProblem();
      if (params) {
        await handleProblemGeneration(
          "adventOfCode",
          `${params.year}/${params.day}`,
        );
      }
    },
  };

  async function handleProblemGeneration(
    source: ProblemSource,
    id?: string,
  ): Promise<void> {
    try {
      const problem = await apiService.fetchProblem(source, id);
      await fileService.createProblemFiles(problem);
      vscode.window.showInformationMessage("Problem created! Get to solving.");
    } catch (error) {
      logger.error("Failed to generate problem", error);
      vscode.window.showErrorMessage(
        "Failed to create problem. Check output for details.",
      );
    }
  }

  // Register commands
  Object.entries(commandHandlers).forEach(([command, handler]) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, handler),
    );
  });
}

export function deactivate(): void {
  Logger.getInstance().info("Puzzles extension is now deactivated!");
}
