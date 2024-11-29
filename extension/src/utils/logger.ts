import * as vscode from "vscode";

export class Logger {
  private static instance: Logger;
  private outputChannel: vscode.OutputChannel;

  private constructor() {
    this.outputChannel = vscode.window.createOutputChannel("Puzzles");
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string): void {
    this.log("INFO", message);
  }

  error(message: string, error?: unknown): void {
    this.log(
      "ERROR",
      `${message}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`[${timestamp}] ${level}: ${message}`);
  }
}
