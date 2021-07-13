import { Connection } from "vscode-languageserver";

// The LS settings
interface Settings {
  showHoverInfo: boolean;
  provideCssClassGoToDefinition: boolean;
  provideCssClassCompletion: boolean;
}

// singleton class to return users extension settings
export default new class SettingsService {
  connection?: Connection;

  // cache the settings of all open documents
  documentSettings: Map<string, Thenable<Settings>> = new Map<string, Thenable<Settings>>();

  init(currentConnection: Connection) {
    this.connection = currentConnection;
  }

  /**
   * Closest vscode setting for the current resource or the global setting will be retrieved
   *
   * @param resource - File which the user is currently interacting with
   * @returns {Thenable<Settings>}
   */
  getDocumentSettings(resource: string): Thenable<Settings> {
    if (!this.connection)
      throw new Error("Connection has to be set via the 'setConnection' method before starting to get the settings.");

    let result = this.documentSettings.get(resource);
    if (!result) {
      result = this.connection.workspace.getConfiguration({
        scopeUri: resource,
        section: "P!VHandlebarsLanguageServer",
      });
      this.documentSettings.set(resource, result);
    }
    return result;
  }

  /**
   * setting has been modified, clear the cache
   */
  clearDocumentSettingsCache() {
    // Reset all cached document settings
    this.documentSettings.clear();
  }
}();
