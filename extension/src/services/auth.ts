// src/services/auth.ts

import { ExtensionContext, SecretStorage } from "vscode";

export default class AuthSettings {
  private static _instance: AuthSettings;

  constructor(private secretStorage: SecretStorage) {}

  static init(context: ExtensionContext): void {
    AuthSettings._instance = new AuthSettings(context.secrets);
  }

  static get instance(): AuthSettings {
    return AuthSettings._instance;
  }

  async storeAoCSession(session?: string): Promise<void> {
    if (session) {
      await this.secretStorage.store("aoc_session", session);
    }
  }

  async getAoCSession(): Promise<string | undefined> {
    return await this.secretStorage.get("aoc_session");
  }
}
