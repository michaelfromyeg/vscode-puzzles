import * as vscode from "vscode";
import { SupportedLanguage, TemplateFormat } from "./types";

export class Config {
  private static readonly SECTION = "puzzles";

  static getBaseUrl(): string {
    return process.env["NODE_ENV"] === "development"
      ? "http://localhost:8000"
      : "https://api.puzzles.michaeldemar.co";
  }

  static getDefaultLanguage(): SupportedLanguage {
    const language = vscode.workspace
      .getConfiguration(this.SECTION)
      .get<SupportedLanguage>("defaultLanguage", "python");

    // Runtime check to ensure type safety
    if (!this.isSupportedLanguage(language)) {
      vscode.window.showWarningMessage(
        `Unsupported language: ${language}. Falling back to Python.`,
      );
      return "python";
    }

    return language;
  }

  static getTemplateFormat(): TemplateFormat {
    const format = vscode.workspace
      .getConfiguration(this.SECTION)
      .get<TemplateFormat>("templateFormat", "markdown");

    // Runtime check to ensure type safety
    if (!this.isTemplateFormat(format)) {
      vscode.window.showWarningMessage(
        `Unsupported template format: ${format}. Falling back to markdown.`,
      );
      return "markdown";
    }

    return format;
  }

  private static isSupportedLanguage(lang: unknown): lang is SupportedLanguage {
    const supportedLanguages: SupportedLanguage[] = [
      "python",
      "javascript",
      "typescript",
      "java",
      "cpp",
    ];
    return (
      typeof lang === "string" &&
      supportedLanguages.includes(lang as SupportedLanguage)
    );
  }

  private static isTemplateFormat(format: unknown): format is TemplateFormat {
    const supportedFormats: TemplateFormat[] = ["markdown", "text"];
    return (
      typeof format === "string" &&
      supportedFormats.includes(format as TemplateFormat)
    );
  }

  static getSupportedLanguages(): SupportedLanguage[] {
    return ["python", "javascript", "typescript", "java", "cpp"];
  }

  static getSupportedFormats(): TemplateFormat[] {
    return ["markdown", "text"];
  }
}
