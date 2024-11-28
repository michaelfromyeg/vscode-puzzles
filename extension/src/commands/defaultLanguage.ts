import * as vscode from "vscode";

import { Config } from "../config";
import { SupportedLanguage } from "../types";

export async function setDefaultLanguage(): Promise<void> {
  const languages = Config.getSupportedLanguages();
  const currentLanguage = Config.getDefaultLanguage();

  const languageItems: vscode.QuickPickItem[] = languages.map((lang) => ({
    label: lang,
    description: lang === currentLanguage ? "(current)" : undefined,
    picked: lang === currentLanguage,
  }));

  const selected = await vscode.window.showQuickPick(languageItems, {
    placeHolder: "Select default programming language",
    title: "Set Default Language",
  });

  if (selected) {
    await vscode.workspace
      .getConfiguration("puzzles")
      .update(
        "defaultLanguage",
        selected.label as SupportedLanguage,
        vscode.ConfigurationTarget.Global,
      );

    vscode.window.showInformationMessage(
      `Default language set to ${selected.label}`,
    );
  }
}
