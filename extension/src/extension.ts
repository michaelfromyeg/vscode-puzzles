// src/extension.ts

import axios from "axios";
import * as vscode from "vscode";
import { getAdventOfCodeProblem } from "./commands/adventOfCode";
import { setDefaultLanguage } from "./commands/defaultLanguage";
import { ApiService } from "./services/api";
import AuthSettings from "./services/auth";
import { FileService } from "./services/file";
import { ProblemSource } from "./types";
import { Logger } from "./utils/logger";

export function activate(context: vscode.ExtensionContext): void {
  // Initialize our Secret Storage
  AuthSettings.init(context);
  const authSettings = AuthSettings.instance;

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
    "extsn.setAoCSession": async () => {
      const session = await vscode.window.showInputBox({
        prompt: "Enter your Advent of Code session cookie",
        password: true,
        placeHolder: "Paste your session cookie here",
        ignoreFocusOut: true,
      });
      if (session) {
        try {
          // Validate the session cookie
          const response = await axios.get(
            "https://adventofcode.com/2015/day/1/input",
            {
              headers: {
                Cookie: `session=${session}`,
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              },
            },
          );
          if (response.status === 200) {
            await authSettings.storeAoCSession(session);
            vscode.window.showInformationMessage(
              "Advent of Code session cookie saved successfully!",
            );
          }
        } catch (error) {
          vscode.window.showErrorMessage(
            "Invalid session cookie. Please check your cookie and try again.",
          );
        }
      }
    },
    "extsn.getAdventOfCode": async () => {
      let input: string | undefined;
      const params = await getAdventOfCodeProblem();

      if (params) {
        try {
          let session = await authSettings.getAoCSession();
          if (!session) {
            const response = await vscode.window.showInformationMessage(
              "Advent of Code session cookie not found. Would you like to set it now?",
              "Yes",
              "No",
            );
            if (response === "Yes") {
              await commandHandlers["extsn.setAoCSession"]();
              session = await authSettings.getAoCSession();
              if (!session) {
                // User cancelled or setting failed
                return;
              }
            } else {
              return;
            }
          }

          // Fetch the input
          const response = await axios.get(
            `https://adventofcode.com/${params.year}/day/${params.day}/input`,
            {
              headers: {
                Cookie: `session=${session}`,
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              },
            },
          );
          input = response.data;
        } catch (error) {
          vscode.window.showErrorMessage(
            error instanceof Error
              ? error.message
              : "Failed to fetch puzzle input",
          );
        }

        try {
          const problemDate = new Date(params.year, 11, params.day); // Month is 0-based
          await handleProblemGeneration(
            "adventOfCode",
            `${params.year}/${params.day}`,
            { date: problemDate, input },
          );
        } catch (error) {
          logger.error("Failed to generate Advent of Code problem", error);
          vscode.window.showErrorMessage(
            "Failed to create Advent of Code problem. Check output for details.",
          );
        }
      }
    },
  };

  // Register commands
  Object.entries(commandHandlers).forEach(([command, handler]) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, handler),
    );
  });

  async function handleProblemGeneration(
    source: ProblemSource,
    id?: string,
    options: { date?: Date; input?: string } = {},
  ): Promise<void> {
    try {
      const problem = await apiService.fetchProblem(source, id);
      await fileService.createProblemFiles(problem, options);
      vscode.window.showInformationMessage("Problem created! Get to solving.");
    } catch (error) {
      // TODO(michaelfromyeg): way better error handling here
      logger.error("Failed to generate problem", error);
      vscode.window.showErrorMessage(
        "Failed to create problem. Check output for details.",
      );
    }
  }
}

export function deactivate(): void {
  Logger.getInstance().info("Puzzles extension is now deactivated!");
}
